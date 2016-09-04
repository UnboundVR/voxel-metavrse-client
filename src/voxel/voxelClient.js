import engine from 'voxel-engine';
import io from 'socket.io-client';
import coding from './coding';
import types from './blockTypes';
import compression from './compression';
import clientSettings from './settings.json';
import extend from 'extend';
import Promise from 'bluebird';
import consts from '../constants';
import playerSync from '../playerSync';
import loading from '../loading';
import auth from '../auth';
import clone from 'clone';
import events from '../events';
import coordsHelper from './voxelCoordsHelper';
import chat from '../chat';

let initialized = false;

export default {
  async init() {
    return await this.connect();
  },
  async connect() {
    this.socket = io.connect(consts.SERVER_ADDRESS() + '/voxel');
    this.socket.on('disconnect', () => {
      // TODO handle disconnection
      chat.debug('Disconnected from server...');
    });
    return await this.bindEvents();
  },
  bindEvents() {
    let self = this;
    let loadingResource = loading.log('Loading map...');

    async function extractChunkVoxels(chunk) {
      let voxels = {};

      function getUniqueIds(voxels) {
        let blockTypeIds = {};
        for (let pos of Object.keys(voxels)) {
          let block = voxels[pos];
          if(block > 1) {
            blockTypeIds[block] = true;
          }
        }
        return Object.keys(blockTypeIds).map(id => parseInt(id));
      }

      await types.loadMany(getUniqueIds(chunk.voxels));
      for (let pos of Object.keys(chunk.voxels)) {
        let block = chunk.voxels[pos];
        if(block) {
          var blockType = types.getById(block);
          voxels[pos] = (block == 1) ? 1 : blockType.material;

          if(block != 1 && blockType.code) {
            let coords = coordsHelper.getAbsoluteCoords(chunk, pos);
            coding.storeCode(coords, blockType.id);
          }
        }
      }

      return voxels;
    }

    async function processChunk(chunk) {
      chunk.voxels = compression.uncompress(chunk.voxels);
      let originalChunk = clone(chunk);
      chunk.voxels = await extractChunkVoxels(chunk);
      self.engine.showChunk(chunk);

      // We're doing this after the call to extractChunkVoxels because we need the calls to coding.storeCoed to be already made
      events.emit(consts.events.LOAD_TESTING_CODE, originalChunk);
    }

    let promisifiedEmit = Promise.promisify(self.socket.emit).bind(self.socket);

    let initialChunksAmount, initialChunksLoadedAmount = 0;

    async function requestAndLoadChunk(chunkPosition) {
      try {
        // console.log(`Requesting chunk at ${chunkPosition.join('|')}`);
        let chunk = await promisifiedEmit('requestChunk', chunkPosition);
        // console.log(`Processing chunk at ${chunkPosition.join('|')}`);
        await processChunk(chunk);
        // console.log(`Loaded chunk at ${chunkPosition.join('|')}`);

        if(initialChunksAmount > initialChunksLoadedAmount) {
          loadingResource.update(`Loaded chunk ${++initialChunksLoadedAmount} of ${initialChunksAmount}...`);
        }
      } catch(err) {
        if(initialChunksAmount > initialChunksLoadedAmount) {
          loadingResource.error(`Error getting chunk: ${err}`);
        }
        chat.error('Error getting chunk', err);
      }
    }

    async function loadInitialChunks(settings) {
      let initialVoxelPos = playerSync.getInitialPosition(settings);
      let chunkPos = self.engine.voxels.chunkAtPosition(initialVoxelPos);
      let dist = settings.chunkDistance;

      let initialPositions = [];
      for(let i = -1 * dist; i < dist; i++) {
        for(let j = -1 * dist; j < dist; j++) {
          for(let k = -1 * dist; k < dist; k++) {
            initialPositions.push([chunkPos[0] + i, chunkPos[1] + j, chunkPos[2] + k]);
          }
        }
      }

      initialChunksAmount = initialPositions.length;
      await Promise.all(initialPositions.map(requestAndLoadChunk));
    }

    this.socket.on('newChunkOwner', (chunkId, ownerId) => {
      let chunk = self.engine.voxels.chunks[chunkId];
      chunk.owners.push(ownerId);
    });

    this.socket.on('set', async (pos, val) => {
      if(coding.hasTestingCode(pos)) {
        let testingCode = coding.getTestingCode(pos);
        chat.debug(`Another user has changed the block at ${pos}, which had locally testing code. We're thus removing that code. Here's a copy in case you wanna keep it:\n ${testingCode}`);
        coding.clearTestingCode(pos);
      }

      if(val == 0) {
        coding.removeCode(pos);
        self.engine.setBlock(pos, 0);
        // Temporarily commented out because no other coding event call is networked (i.e. there are no RPCs yet)
        // events.emit(consts.events.REMOVE_ADJACENT, {}, block => block.adjacentTo(pos));
        return;
      }

      await types.load(val);
      let type = types.getById(val);
      if(type.code) {
        coding.storeCode(pos, type.id);
      }

      self.engine.setBlock(pos, type.material);
      // Temporarily commented out because no other coding event call is networked (i.e. there are no RPCs yet)
      // events.emit(consts.events.PLACE_ADJACENT, {}, block => block.adjacentTo(pos));
    });

    return new Promise((resolve, reject) => {
      this.socket.on('init', async data => {
        loadingResource.update('Got map settings from server...');

        if(initialized) {
          if(loadingResource.finished) {
            chat.debug('Reconnecting to server...');
          } else {
            loadingResource.error('Server got disconnected while loading, please refresh');
            reject(new Error('Server got disconnected while loading'));
          }
        } else {
          initialized = true;
          let settings = extend({}, data.settings, clientSettings);
          self.engine = engine(settings);
          self.engine.settings = settings;

          await loadInitialChunks(settings);
          self.engine.voxels.on('missingChunk', requestAndLoadChunk);

          loadingResource.finish('Finished loading map');

          resolve(self.engine);
        }
      });
    });
  },
  setBlock(position, type) {
    this.socket.emit('set', auth.getAccessToken(), position, type);
  },
  clearBlock(position) {
    this.setBlock(position, 0);
  },
  getChunkAtPosition(position) {
    let chunkPos = this.engine.voxels.chunkAtPosition(position);
    return this.engine.voxels.chunks[chunkPos.join('|')];
  }
};

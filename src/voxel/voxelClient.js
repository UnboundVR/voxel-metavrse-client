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
// import events from '../events';
import loading from '../loading';

let initialized = false;

export default {
  init() {
    let self = this;
    this.connect();
    return new Promise(resolve => {
      self.onReady = resolve;
    });
  },
  connect() {
    this.socket = io.connect(consts.SERVER_ADDRESS() + '/voxel');
    this.socket.on('disconnect', () => {
      // TODO handle disconnection
      console.log('Disconnected from server...');
    });
    this.bindEvents();
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

      function getCoords(pos, dims) { // FIXME this only works for cubic chunks (i.e. all dims are the same)
        let d = dims[0];
        let z = Math.floor(pos / (d * d));
        let y = Math.floor((pos - d * d * z) / d);
        let x = Math.floor(pos - d * d * z - d * y);

        x += chunk.position[0] * d;
        y += chunk.position[1] * d;
        z += chunk.position[2] * d;

        return [x, y, z];
      }

      await types.loadMany(getUniqueIds(chunk.voxels));
      for (let pos of Object.keys(chunk.voxels)) {
        let block = chunk.voxels[pos];
        if(block) {
          var blockType = types.getById(block);
          voxels[pos] = (block == 1) ? 1 : blockType.material;
          if(block != 1 && blockType.code) {
            let coords = getCoords(pos, chunk.dims);
            coding.storeCode(coords, blockType.id);
          }
        }
      }

      return voxels;
    }

    async function processChunk(chunk) {
      chunk.voxels = compression.uncompress(chunk.voxels);
      chunk.voxels = await extractChunkVoxels(chunk);
      self.engine.showChunk(chunk);
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
        } else {
          console.log('Error getting chunk', err);
          alert('Error getting chunk');
        }
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

    this.socket.on('init', async data => {
      loadingResource.update('Got map settings from server...');

      if(initialized) {
        console.log('Reconnecting to server...');
      } else {
        initialized = true;
        let settings = extend({}, data.settings, clientSettings);
        self.engine = engine(settings);
        self.engine.settings = settings;

        await loadInitialChunks(settings);
        self.engine.voxels.on('missingChunk', requestAndLoadChunk);
        self.onReady(self.engine);

        loadingResource.finish('Finished loading map');
      }
    });

    this.socket.on('set', async (pos, val) => {
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
  },
  setBlock(position, type) {
    this.socket.emit('set', position, type);
  },
  clearBlock(position) {
    this.setBlock(position, 0);
  }
};

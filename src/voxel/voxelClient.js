import engine from 'voxel-engine';
import io from 'socket.io-client';
import coding from './coding';
import types from './blockTypes';
import compression from './compression';
import clientSettings from './settings.json';
import extend from 'extend';

export default {
  init() {
    let self = this;
    this.connect();
    return new Promise(resolve => {
      self.onReady = resolve;
    });
  },
  connect() {
    this.socket = io.connect(process.env.SERVER_ADDRESS + '/voxel');
    this.socket.on('disconnect', () => {
      // TODO handle disconnection
    });
    this.bindEvents();
  },
  bindEvents() {
    let self = this;

    function extractChunkVoxels(chunk) {
      let voxels = {};

      function getUniqueIds(voxels) {
        let blockTypeIds = {};
        Object.keys(voxels).forEach(pos => {
          let block = voxels[pos];
          if(block > 1) {
            blockTypeIds[block] = true;
          }
        });
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

      return types.loadMany(getUniqueIds(chunk.voxels)).then(() => {
        Object.keys(chunk.voxels).forEach(pos => {
          let block = chunk.voxels[pos];
          if(block) {
            var blockType = types.getById(block);
            voxels[pos] = (block == 1) ? 1 : blockType.material;
            if(block != 1 && blockType.code) {
              let coords = getCoords(pos, chunk.dims);
              coding.storeCode(coords, blockType.id);
            }
          }
        });

        return voxels;
      });
    }

    function processChunk(chunk) {
      chunk.voxels = compression.uncompress(chunk.voxels);
      return extractChunkVoxels(chunk).then(voxels => {
        chunk.voxels = voxels;
        self.engine.showChunk(chunk);
      });
    }

    this.socket.on('init', data => {
      let settings = extend({}, data.settings, clientSettings);
      self.engine = engine(settings);
      self.engine.settings = settings;

      Promise.all(data.chunks.map(processChunk)).then(() => {
        self.onReady(self.engine);

        self.engine.voxels.on('missingChunk', chunkPosition => {
          self.socket.emit('requestChunk', chunkPosition, (err, chunk) => {
            if(err) {
              alert('Error getting chunk: ', err);
            } else {
              processChunk(chunk);
            }
          });
        });
      });
    });

    this.socket.on('set', (pos, val, forceUpdateType) => {
      if(val == 0) {
        coding.removeCode(pos);
        self.engine.setBlock(pos, 0); // TODO raise REMOVE_ADJACENT event too
        return;
      }

      types.load(val, forceUpdateType).then(() => {
        var type = types.getById(val);
        if(type.code) {
          coding.storeCode(pos, type.id);
        }

        self.engine.setBlock(pos, type.material); // TODO raise PLACE_ADJACENT event too
      });
    });
  },
  setBlock(position, type, typeUpdated) {
    this.socket.emit('set', position, type, typeUpdated);
  },
  clearBlock(position) {
    this.setBlock(position, 0);
  }
};

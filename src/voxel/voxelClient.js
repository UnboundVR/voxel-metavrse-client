import engine from 'voxel-engine';
import io from 'socket.io-client';
import coding from './coding';
import types from './blockTypes';

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

      let blockTypeIds = {};
      Object.keys(chunk.voxels).forEach(pos => {
        let block = chunk.voxels[pos];
        if(block > 1) {
          blockTypeIds[block] = true;
        }
      });

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

      return types.loadMany(Object.keys(blockTypeIds)).then(() => {
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

    function rlDecode(input) {
      let output = [];
      input.forEach(item => {
        for (var i = 0; i < item[0]; i++) {
          output.push(item[1]);
        }
      });

      return output;
    }

    function processChunk(chunk) {
      chunk.voxels = rlDecode(chunk.voxels);
      return extractChunkVoxels(chunk).then(voxels => {
        chunk.voxels = voxels;
        self.engine.showChunk(chunk);
      });
    }

    this.socket.on('init', data => {
      let settings = data.settings;
      let chunks = data.chunks;
      let materials = data.materials;

      settings.controls = {discreteFire: true};
      settings.generateChunks = false;
      settings.controlsDisabled = false;
      settings.materials = materials;
      settings.texturePath = 'assets/textures/';
      settings.keybindings = {
        'W': 'forward',
        'A': 'left',
        'S': 'backward',
        'D': 'right',
        '<up>': 'forward',
        '<left>': 'left',
        '<down>': 'backward',
        '<right>': 'right',
        '<mouse 1>': 'fire',
        '<mouse 3>': 'firealt',
        '<space>': 'jump',
        '<shift>': 'crouch',
        '<control>': 'alt'
      };

      self.engine = self.createEngine(settings);

      Promise.all(chunks.map(processChunk)).then(() => {
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
  createEngine(settings) {
    let self = this;
    self.engine = engine(settings);
    self.engine.settings = settings;

    return self.engine;
  },
  setBlock(position, type, typeUpdated) {
    this.socket.emit('set', position, type, typeUpdated);
  },
  clearBlock(position) {
    this.setBlock(position, 0);
  }
};

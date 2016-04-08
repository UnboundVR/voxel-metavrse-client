import engine from 'voxel-engine';
import io from 'socket.io-client';
import marketplace from './marketplace';
import coding from './coding';
import voxelEngine from './voxelEngine';
import map from './map';

export default {
  init() {
    var self = this;
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
    var self = this;

    var extractChunkVoxels = chunk => {
      let voxels = {};

      let blockTypeIds = {};
      Object.keys(chunk.voxels).forEach(pos => {
        let block = chunk.voxels[pos];
        if(block > 1) {
          blockTypeIds[block] = true;
        }
      });

      return marketplace.loadBlockTypes(Object.keys(blockTypeIds)).then((newTypes) => {
        return Promise.all(newTypes.filter(type => type.code).map(coding.addBlockTypeCode)).then(() => {
          Object.keys(chunk.voxels).forEach(pos => {
            let block = chunk.voxels[pos];
            if(block) {
              var blockType = marketplace.getBlockTypeById(block);
              voxels[pos] = (block == 1) ? 1 : blockType.material;
              if(block != 1 && blockType.code) {
                var d = chunk.dims[0];
                var z = Math.floor(pos / (d * d));
                var y = Math.floor((pos - d * d * z) / d);
                var x = Math.floor(pos - d * d * z - d * y);

                x += chunk.position[0] * d;
                y += chunk.position[1] * d;
                z += chunk.position[2] * d;

                coding.storeCode([x, y, z], blockType.id); // FIXME this only works for cubic chunks (i.e. all dims are the same)
              }
            }
          });

          return voxels;
        });
      });
    };

    function rlDecode(input) {
      let output = [];
      input.forEach(item => {
        for (var i = 0; i < item[0]; i++) {
          output.push(item[1]);
        }
      });

      return output;
    }

    var processChunk = chunk => {
      chunk.voxels = rlDecode(chunk.voxels);
      return extractChunkVoxels(chunk).then(voxels => {
        chunk.voxels = voxels;
        self.engine.showChunk(chunk);
      });
    };

    this.socket.on('init', data => {
      var settings = data.settings;
      var chunks = data.chunks;

      settings.controls = {discreteFire: true};
      settings.generateChunks = false;
      settings.controlsDisabled = false;
      settings.materials = marketplace.getMaterials();
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
      voxelEngine.init(self.engine);

      Promise.all(chunks.map(processChunk)).then(() => {
        self.onReady();
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

    this.socket.on('set', (pos, val, typeUpdated) => {
      if(val == 0) {
        return map.removeBlock(pos, true);
      }

      if(!typeUpdated && marketplace.getBlockTypeById(val)) {
        map.placeBlock(pos, val, true);
      } else {
        marketplace.loadBlockTypes([val], typeUpdated).then((newTypes) => {
          var newType = newTypes[0];
          if(newType.code) {
            coding.addBlockTypeCode(newType).then(() => {
              coding.storeCode(pos, newType.id);
            });
          }
          map.placeBlock(pos, val, true);
        });
      }
    });
  },
  createEngine(settings) {
    var self = this;
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

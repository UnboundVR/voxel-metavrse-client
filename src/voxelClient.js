import engine from 'voxel-engine';
import io from 'socket.io-client';
import marketplace from './marketplace';
import coding from './coding';
import voxelEngine from './voxelEngine';

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

    var extractChunk = chunk => {
      var code = [];
      var voxels = {};
      var blockTypes = marketplace.blockTypesById();

      Object.keys(chunk.voxels).forEach(pos => {
        let block = chunk.voxels[pos];
        if(block) {
          voxels[pos] = (block == 1) ? 1 : blockTypes[block].material;
          if(block != 1 && blockTypes[block].code) {
            var d = chunk.dims[0];
            var z = Math.floor(pos / (d * d));
            var y = Math.floor((pos - d * d * z) / d);
            var x = Math.floor(pos - d * d * z - d * y);

            x += chunk.position[0] * d;
            y += chunk.position[1] * d;
            z += chunk.position[2] * d;

            code.push({
              position: [x, y, z], // FIXME this only works for cubic voxels (i.e. all dims are the same)
              codeObj: blockTypes[block].code
            });
          }
        }
      });

      return {
        voxels,
        code
      };
    };

    var processChunk = chunk => {
      let processedChunk = extractChunk(chunk);
      chunk.voxels = processedChunk.voxels;
      coding.loadCode(processedChunk.code);
      self.engine.showChunk(chunk);
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

      chunks.forEach(processChunk);

      self.engine.voxels.on('missingChunk', chunkPosition => {
        self.socket.emit('requestChunk', chunkPosition, (err, chunk) => {
          if(err) {
            alert('Error getting chunk: ', err);
          } else {
            processChunk(chunk);
          }
        });
      });

      self.onReady();
    });

    this.socket.on('set', (pos, val) => {
      self.engine.setBlock(pos, val);
    });
  },
  createEngine(settings) {
    var self = this;
    self.engine = engine(settings);
    self.engine.settings = settings;

    return self.engine;
  },
  setBlock(position, type) {
    this.socket.emit('set', position, type);
  },
  clearBlock(position) {
    this.setBlock(position, 0);
  }
};

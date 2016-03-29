import engine from 'voxel-engine';
import io from 'socket.io-client';
import blocks from './blocks';

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

    var processChunk = chunk => {
      self.engine.showChunk(chunk);
    };

    this.socket.on('init', data => {
      var settings = data.settings;
      var chunks = data.chunks;
      blocks.init(data.blockTypes);

      settings.controls = {discreteFire: true};
      settings.generateChunks = false;
      settings.controlsDisabled = false;
      settings.materials = blocks.getMaterials();
      settings.texturePath = 'assets/textures/';

      self.engine = self.createEngine(settings);
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

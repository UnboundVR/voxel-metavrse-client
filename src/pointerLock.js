import voxel from './voxel';
var pointerLock = require('pointer-lock');

export default {
  request() {
    voxel.engine.interact.request();
  },
  release() {
    voxel.engine.interact.release();
  },
  available() {
    return pointerLock.available();
  }
};

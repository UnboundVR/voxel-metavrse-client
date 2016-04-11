import voxel from './voxel';
import pointerLock from 'pointer-lock';

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

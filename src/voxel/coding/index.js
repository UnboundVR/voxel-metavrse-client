import classes from './classes';
import instances from './instances';
import launchIde from './launchIde';
import scripts from './scripts';

export default {
  removeCode: instances.removeCode.bind(instances),
  storeCode: instances.storeCode.bind(instances),
  editCode: launchIde,
  registerBlockType: scripts.loadClass.bind(scripts),
  setVoxelEngine(engine) {
    classes.voxelEngine = engine;
  }
};

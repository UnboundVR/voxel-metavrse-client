import prototypes from './prototypes';
import instances from './instances';
import launchIde from './launchIde';
import executor from './scriptExecutor';

export default {
  removeCode: instances.removeCode.bind(instances),
  storeCode: instances.storeCode.bind(instances),
  editCode: launchIde,
  registerBlockType: executor.loadPrototype.bind(executor),
  setVoxelEngine(engine) {
    prototypes.voxelEngine = engine;
  }
};

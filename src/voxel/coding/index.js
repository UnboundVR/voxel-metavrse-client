import controller  from './controller';
import launchIde from './launchIde';

export default {
  removeCode: controller.removeCode.bind(controller),
  storeCode: controller.storeCode.bind(controller),
  editCode: launchIde,
  registerBlockType: controller.registerBlockType.bind(controller),
  setVoxelEngine(engine) {
    controller.voxelEngine = engine;
  },
  setBroadcast(broadcast) {
    controller.broadcastSetBlock = broadcast;
  }
};

import controller  from './controller';
import launchIde from './launchIde';
import prototypes from './prototypes';

export default {
  init: controller.init.bind(controller),
  removeCode: controller.removeCode.bind(controller),
  storeCode: controller.storeCode.bind(controller),
  editCode: launchIde,
  loadPrototype: prototypes.loadPrototype.bind(prototypes),
  addBlockTypeCode: controller.addBlockTypeCode.bind(controller)
};

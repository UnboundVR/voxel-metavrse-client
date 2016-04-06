import controller  from './controller';
import launchIde from './launchIde';

export default {
  init: controller.init.bind(controller),
  removeCode: controller.removeCode.bind(controller),
  storeCode: controller.storeCode.bind(controller),
  editCode: launchIde
};

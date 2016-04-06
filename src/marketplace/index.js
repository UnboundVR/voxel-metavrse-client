import controller from './controller';
import MarketplaceComponent from './MarketplaceComponent.vue';
import Vue from 'vue';

export default {
  init() {
    Vue.component('marketplace-component', MarketplaceComponent);
    return controller.init();
  },
  getMaterials() {
    return controller.materials;
  },
  getItemTypes() {
    return controller.itemTypes;
  },
  getBlockTypes() {
    return controller.blockTypes;
  },
  getblockTypeById(id) {
    let block = null;
    controller.blockTypes.forEach(type => {
      if(type.id == id) {
        block = type;
      }
    });
    return block;
  },
  addBlockType: controller.addBlockType.bind(controller),
  open() {
    controller.open();
  }
};

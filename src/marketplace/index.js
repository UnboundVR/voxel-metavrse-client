import controller from './controller';
import MarketplaceComponent from './MarketplaceComponent.vue';
import Vue from 'vue';

export default {
  init() {
    Vue.component('marketplace-component', MarketplaceComponent);
    return controller.init();
  },
  getMaterials() {
    return controller.allMaterials;
  },
  getItemTypes() {
    return controller.loadedItemTypes;
  },
  getBlockTypes() {
    return controller.loadedBlockTypes;
  },
  getToolbarItems() {
    return controller.toolbarItems;
  },
  getBlockTypeById(id) {
    let blockType = null;
    controller.loadedBlockTypes.forEach(type => {
      if(type.id == id) {
        blockType = type;
      }
    });
    return blockType;
  },
  getItemTypeById(id) {
    let itemType = null;
    controller.loadedItemTypes.forEach(type => {
      if(type.id == id) {
        itemType = type;
      }
    });
    return itemType;
  },
  addBlockType: controller.addBlockType.bind(controller),
  loadItemTypes: controller.loadItemTypes.bind(controller),
  loadBlockTypes: controller.loadBlockTypes.bind(controller),
  open() {
    controller.bringAllItems().then(() => controller.open());
  }
};

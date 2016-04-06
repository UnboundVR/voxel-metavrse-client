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
  blockTypesById() {
    let result = {};
    controller.blockTypes.forEach(type => {
      result[type.id] = type;
    });
    return result;
  },
  open() {
    controller.open();
  }
};

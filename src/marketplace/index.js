import controller from './controller';
import MarketplaceComponent from './MarketplaceComponent.vue';
import Vue from 'vue';

export default {
  init() {
    Vue.component('marketplace-component', MarketplaceComponent);
    controller.init();
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
  open() {
    controller.open();
  }
};

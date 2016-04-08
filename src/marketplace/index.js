import controller from './controller';
import MarketplaceComponent from './MarketplaceComponent.vue';
import Vue from 'vue';

export default {
  init() {
    Vue.component('marketplace-component', MarketplaceComponent);
  },
  open() {
    controller.bringAllItems().then(() => controller.open());
  }
};

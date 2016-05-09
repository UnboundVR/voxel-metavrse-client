import controller from './controller';
import InventoryComponent from './InventoryComponent.vue';
import Vue from 'vue';

export default {
  init() {
    Vue.component('inventory-component', InventoryComponent);
  },
  open() {
    controller.bringAllItems().then(() => controller.open());
  },
  addBlockType: controller.addBlockType.bind(controller)
};

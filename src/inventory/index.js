import controller from './controller';
import InventoryComponent from './InventoryComponent.vue';
import Vue from 'vue';
import consts from '../constants';
import events from '../events';

export default {
  init() {
    Vue.component('inventory-component', InventoryComponent);

    events.on(consts.events.OPEN_INVENTORY, this.open.bind(this));
  },
  open() {
    controller.bringAllItems().then(() => controller.open());
  },
  addBlockType: controller.addBlockType.bind(controller),
  updateBlockCode: controller.updateBlockCode.bind(controller),
  addItemType: controller.addItemType.bind(controller),
  updateItemCode: controller.updateItemCode.bind(controller)
};

import ToolbarComponent from './ToolbarComponent.vue';
import Vue from 'vue';
import service from './service';

export default {
  init() {
    return service.init().then(() => {
      Vue.component('toolbar-component', ToolbarComponent);
    });
  },
  getSelected() {
    return service.selectedItem;
  },
  getItems() {
    return service.items;
  },
  isAdjacentActive: service.isAdjacentActive.bind(service),
  setItem: service.setItem.bind(service),
  removeItem: service.removeItem.bind(service),
  isDeleteMode() {
    return service.deleteMode;
  }
};

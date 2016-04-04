import ToolbarComponent from './ToolbarComponent.vue';
import Vue from 'vue';
import service from './service';
import highlight from './blockHighlight';
import voxelEngine from '../voxelEngine';
import executor from './itemExecutor';
import voxelClient from '../voxelClient';

export default {
  init() {
    service.init(voxelClient.itemTypes, voxelClient.blockTypes);
    highlight.init();

    Vue.component('toolbar-component', ToolbarComponent);

    voxelEngine.onFire((target, state) => {
      var position = executor.isAdjacentActive() ? highlight.getPlacePosition() : highlight.getEditPosition();
      switch(state.fire) {
        case 1:
          executor.leftClick(position);
          break;
        case 0:
          executor.rightClick(position);
          break;
      }
    });
  },
  getSelected() {
    return service.selectedItem;
  }
};

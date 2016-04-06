import ToolbarComponent from './ToolbarComponent.vue';
import Vue from 'vue';
import service from './service';
import highlight from './blockHighlight';
import voxelEngine from '../voxelEngine';
import executor from './itemExecutor';

export default {
  init() {
    return service.init().then(() => {
      highlight.init();

      Vue.component('toolbar-component', ToolbarComponent);

      voxelEngine.onFire((target, state) => {
        var position = service.isAdjacentActive() ? highlight.getPlacePosition() : highlight.getEditPosition();
        switch(state.fire) {
          case 1:
            executor.leftClick(position);
            break;
          case 0:
            executor.rightClick(position);
            break;
        }
      });
    });
  },
  getSelected() {
    return service.selectedItem;
  }
};

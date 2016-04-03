import highlight from './blockHighlight';
import voxelEngine from '../voxelEngine';
import executor from './macroExecutor';
import macros from './macros.json';
import toolbar from '../toolbar';

export default {
  init() {
    highlight.init();

    voxelEngine.onFire((target, state) => {
      var position = toolbar.getSelected().isBlock ? highlight.getPlacePosition() : highlight.getEditPosition();
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
  getMacros() {
    return macros;
  }
};

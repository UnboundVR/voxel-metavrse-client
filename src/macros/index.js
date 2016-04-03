import highlight from './blockHighlight';
import voxelEngine from '../voxelEngine';
import executor from './macroExecutor';
import macros from './macros.json';

export default {
  init() {
    highlight.init();

    voxelEngine.onFire((target, state) => {
      var placePosition = highlight.getPlacePosition();
      var editPosition = highlight.getEditPosition();
      switch(state.fire) {
        case 1:
          executor.leftClick(placePosition, editPosition);
          break;
        case 0:
          executor.rightClick(placePosition, editPosition);
          break;
      }
    });
  },
  getMacros() {
    return macros;
  }
};

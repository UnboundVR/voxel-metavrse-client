import highlight from './blockHighlight';
import voxelEngine from '../voxelEngine';
import executor from './macroExecutor';

export default {
  init() {
    highlight.init();

    voxelEngine.onFire((target, state) => {
      var position = highlight.getPosition();
      switch(state.fire) {
        case 1:
          executor.leftClick(position);
          break;
        case 0:
          executor.rightClick(position);
          break;
      }
    });
  }
};

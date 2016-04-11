import toolbar from './toolbar';
import highlight from './blockHighlight';
import voxel from '../voxel';
import executor from './itemExecutor';

export default {
  init() {
    return toolbar.init().then(() => {
      highlight.init();

      voxel.engine.on('fire', (target, state) => {
        var position = toolbar.isAdjacentActive() ? highlight.getPlacePosition() : highlight.getEditPosition();
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
  getToolbarItems: toolbar.getItems.bind(toolbar)
};

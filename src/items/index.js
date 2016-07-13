import toolbar from './toolbar';
import highlight from './blockHighlight';
import voxel from '../voxel';
import executor from './itemExecutor';
import coding from './coding';

export default {
  async init() {
    coding.init();

    await toolbar.init();
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
  },
  getToolbarItems: toolbar.getItems.bind(toolbar),
  setToolbarItem: toolbar.setItem.bind(toolbar),
  removeToolbarItem: toolbar.removeItem.bind(toolbar)
};

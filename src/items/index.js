import toolbar from './toolbar';
import highlight from './blockHighlight';
import voxel from '../voxel';
import executor from './itemExecutor';
import coding from './coding';
import types from './itemTypes';

export default {
  async init() {
    await coding.init();

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
  removeToolbarItem: toolbar.removeItem.bind(toolbar),
  load: types.load.bind(types),
  hasTestingCode: coding.hasTestingCode.bind(coding)
};

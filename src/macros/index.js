import highlight from './blockHighlight';
import toolbar from '../toolbar';
import voxelEngine from '../voxelEngine';
import map from '../map';

export default {
  init() {
    highlight.init();

    voxelEngine.onFire((target, state) => {
      var placePosition = highlight.getPlacePosition();
      var editPosition = highlight.getEditPosition();

      if (placePosition) {
        map.placeBlock(placePosition, toolbar.getSelected());
      } else {
        if (editPosition) {
          if(state.fire === 1) {
            map.removeBlock(editPosition);
          } else {
            map.codeBlock(editPosition);
          }
        }
      }
    });
  }
};

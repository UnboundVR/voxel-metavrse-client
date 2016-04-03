import map from '../map';
import toolbar from '../toolbar';

export default {
  leftClick(position) {
    map.placeBlock(position, toolbar.getSelected());
    // map.removeBlock(position);
  },
  rightClick(position) {
    map.codeBlock(position);
  }
};

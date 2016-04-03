import map from '../map';
import toolbar from '../toolbar';
import selector from './selector';

export default {
  leftClick(position) {
    var macro = selector.getMain();
    switch(macro.name) {
      case 'Place':
        map.placeBlock(position, toolbar.getSelected());
        break;
      case 'Remove':
        map.removeBlock(position);
        break;
      default:
        alert('not supported');
        break;
    }
  },
  rightClick(position) {
    map.codeBlock(position);
  }
};

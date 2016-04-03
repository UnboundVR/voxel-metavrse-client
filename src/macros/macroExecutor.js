import map from '../map';
import toolbar from '../toolbar';

export default {
  leftClick(placePosition, editPosition) {
    var macro = toolbar.getSelected();

    if(macro.isBlock) {
      map.placeBlock(placePosition, macro.textureId);
    } else {
      switch(macro.name) {
        case 'Remove':
          map.removeBlock(editPosition);
          break;
        case 'Code':
          map.codeBlock(editPosition);
          break;
        default:
          alert('not supported');
          break;
      }
    }
  },
  rightClick(position) {
    map.codeBlock(position);
  }
};

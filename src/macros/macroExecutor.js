import map from '../map';
import toolbar from '../toolbar';

export default {
  leftClick(position) {
    var macro = toolbar.getSelected();

    if(macro.isBlock) {
      map.placeBlock(position, macro.textureId);
    } else {
      switch(macro.name) {
        case 'Remove':
          map.removeBlock(position);
          break;
        case 'Code':
          map.codeBlock(position);
          break;
        case 'Interact':
          map.interact(position);
          break;
        default:
          alert('not supported');
          break;
      }
    }
  },
  rightClick(position) {
    map.getInfo(position);
  }
};

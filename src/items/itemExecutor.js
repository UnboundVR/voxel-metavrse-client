import map from '../map';
import toolbar from './toolbar';

export default {
  leftClick(position) {
    if(toolbar.isDeleteMode()) {
      map.removeBlock(position);
      return;
    }

    var item = toolbar.getSelected();

    if(item.isBlock) {
      map.placeBlock(position, item.id);
    } else {
      if(item.name == 'Interact') {
        map.interact(position);
      } else {
        alert('executing ' + item.name);
      }
    }
  },
  rightClick(position) {
    if(!toolbar.isAdjacentActive()) {
      map.codeBlock(position);
    }
  }
};

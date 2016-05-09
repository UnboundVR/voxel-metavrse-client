import map from '../map';
import toolbar from './toolbar';
import coding from './coding';

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
      if(item && !item.isInteract) {
        coding.execute(position);
      } else {
        map.interact(position);
      }
    }
  },
  rightClick(position) {
    if(!toolbar.isAdjacentActive()) {
      map.codeBlock(position);
    }
  }
};

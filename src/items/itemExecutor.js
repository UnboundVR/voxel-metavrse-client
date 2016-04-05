import map from '../map';
import service from './service';

export default {
  leftClick(position) {
    if(service.deleteMode) {
      map.removeBlock(position);
      return;
    }

    var item = service.selectedItem;

    if(item.isBlock) {
      map.placeBlock(position, item.material);
    } else {
      if(item.name == 'Interact') {
        map.interact(position);
      } else {
        alert('executing ' + item.name);
      }
    }
  },
  rightClick(position) {
    if(!service.isAdjacentActive()) {
      map.codeBlock(position);
    }
  }
};

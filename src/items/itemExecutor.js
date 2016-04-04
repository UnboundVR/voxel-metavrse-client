import map from '../map';
import service from './service';
import events from '../events';
import consts from '../constants';

export default {
  leftClick(position) {
    if(service.isDeleteMode()) {
      map.removeBlock(position);
      return;
    }

    var item = service.selectedItem;

    if(item.isBlock) {
      map.placeBlock(position, item.material);
    } else {
      if(item.name == 'Interact') {
        events.emit(consts.events.INTERACT, {}, {position: position});
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

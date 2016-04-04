import map from '../map';
import service from './service';
import voxelEngine from '../voxelEngine';
import events from '../events';
import consts from '../constants';

export default {
  leftClick(position) {
    if(voxelEngine.engine.controls.state.crouch) {
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
    if(!this.isAdjacentActive()) {
      map.codeBlock(position);
    }
  },
  isAdjacentActive() {
    return !voxelEngine.engine.controls.state.crouch && service.selectedItem.adjacentActive;
  }
};

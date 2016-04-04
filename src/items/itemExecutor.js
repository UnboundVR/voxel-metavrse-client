import map from '../map';
import service from './service';
import voxelEngine from '../voxelEngine';

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
      alert('executing ' + item.name);
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

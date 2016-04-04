import map from '../map';
import service from './service';

export default {
  leftClick(position) {
    var item = service.selectedItem;

    if(item.isBlock) {
      map.placeBlock(position, item.textureId);
    } else {
      alert('executing ' + item.name);
    }
  },
  rightClick(position) {
    map.codeBlock(position);
  }
};

import permissions from './permissions';
import coding from './blockCoding';
import placement from './blockPlacement';

export default {
  placeBlock(position, block) {
    if(permissions.canPlace(position)) {
      placement.setBlock(position, block);
    }
  },
  removeBlock(position) {
    if(permissions.canEdit(position)) {
      placement.removeBlock(position);
    }
  },
  interact(position) {
    alert('interact not supported yet ' + position);
  },
  codeBlock(position) {
    if(permissions.canEdit(position)) {
      coding.codeBlock(position);
    }
  },
  getInfo(position) {
    alert('getInfo not supported yet ' + position);
  }
};

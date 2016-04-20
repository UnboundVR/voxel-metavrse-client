import permissions from './permissions';
import events from '../events';
import voxel from '../voxel';
import consts from '../constants';
import placement from './blockPlacement';

export default {
  placeBlock(position, block) {
    if(position && permissions.canPlace(position)) {
      voxel.load(block).then(() => {
        placement.setBlock(position, voxel.getById(block));
      });
    }
  },
  removeBlock(position) {
    if(position && permissions.canEdit(position)) {
      placement.removeBlock(position);
    }
  },
  interact(position) {
    events.emit(consts.events.INTERACT, {}, {position: position});
  },
  codeBlock(position) {
    if(position && permissions.canEdit(position)) {
      voxel.editCode(position).catch(err => {
        alert(err);
      });
    }
  }
};

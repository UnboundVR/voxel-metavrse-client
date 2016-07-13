import permissions from './permissions';
import events from '../events';
import voxel from '../voxel';
import consts from '../constants';
import placement from './blockPlacement';
import auth from '../auth';

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
    events.emit(consts.events.INTERACT, {}, block => block.matchesPosition(position));
  },
  codeBlock(position) {
    if(!auth.isLogged()) {
      return Promise.reject('Please login to be able to edit code');
    }

    if(position && permissions.canEdit(position)) {
      events.emit(consts.events.EDIT_CODE, {
        type: 'block',
        map: position
      });
    }
  }
};

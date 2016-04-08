import permissions from './permissions';
import placement from './blockPlacement';
import events from '../events';
import coding from '../coding';
import consts from '../constants';
import marketplace from '../marketplace';

export default {
  placeBlock(position, block, dontBroadcast) {
    if(position && permissions.canPlace(position)) {
      placement.setBlock(position, marketplace.getBlockTypeById(block), dontBroadcast);
    }
  },
  removeBlock(position, dontBroadcast) {
    if(position && permissions.canEdit(position)) {
      placement.removeBlock(position, dontBroadcast);
    }
  },
  interact(position) {
    events.emit(consts.events.INTERACT, {}, {position: position});
  },
  codeBlock(position) {
    if(position && permissions.canEdit(position)) {
      coding.editCode(position).catch(err => {
        alert(err);
      });
    }
  }
};

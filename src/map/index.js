import events from '../events';
import voxel from '../voxel';
import consts from '../constants';
import placement from './blockPlacement';
import auth from '../auth';
import playerSync from '../playerSync';
import chat from '../chat';

export default {
  init() {
    events.on(consts.events.PLACE_BLOCK, async data => {
      await this.placeBlock(data.position, data.block);
      chat.debug(`Changed block at ${data.position}`);
    });
  },
  async placeBlock(position, block) {
    if(!position) {
      chat.debug(`No position selected when trying to put block ${block}`);
      return;
    }

    if(voxel.hasPermission(position)) {
      await voxel.load(block);
      placement.setBlock(position, voxel.getById(block));
    } else {
      chat.error(`No permissions at ${position.join('|')} ¯\\_(ツ)_/¯`);
    }
  },
  removeBlock(position) {
    if(!position) {
      chat.debug('No position selected');
      return;
    }

    if(voxel.hasPermission(position)) {
      placement.removeBlock(position);
    } else {
      chat.error(`No permissions at ${position.join('|')} ¯\\_(ツ)_/¯`);
    }
  },
  interact(position) {
    events.emit(consts.events.INTERACT, {}, block => block.matchesPosition(position));
  },
  codeBlock(position) {
    if(!auth.isLogged()) {
      chat.error('Please login to be able to edit code');
      return;
    }

    if(position && voxel.hasPermission(position)) {
      events.emit(consts.events.EDIT_CODE, {
        type: 'block',
        map: position
      });
    } else {
      chat.error.log('No permissions at ${position.join('|')}  ¯\\_(ツ)_/¯');
    }
  },
  teleport(position) {
    playerSync.moveUser(position);
  },
  debug: chat.debug.bind(chat),
  error: chat.error.bind(chat)
};

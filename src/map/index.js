import events from '../events';
import voxel from '../voxel';
import consts from '../constants';
import placement from './blockPlacement';
import auth from '../auth';
import playerSync from '../playerSync';

export default {
  init() {
    events.on(consts.events.PLACE_BLOCK, async data => {
      await this.placeBlock(data.position, data.block);
      console.log(`Changed block at ${data.position}`);
    });
  },
  async placeBlock(position, block) {
    if(!position) {
      console.log('No position selected');
      return;
    }

    if(voxel.hasPermission(position)) {
      await voxel.load(block);
      placement.setBlock(position, voxel.getById(block));
    } else {
      console.log(`No permissions at ${position.join('|')} ¯\\_(ツ)_/¯`);
    }
  },
  removeBlock(position) {
    if(!position) {
      console.log('No position selected');
      return;
    }

    if(voxel.hasPermission(position)) {
      placement.removeBlock(position);
    } else {
      console.log(`No permissions at ${position.join('|')} ¯\\_(ツ)_/¯`);
    }
  },
  interact(position) {
    events.emit(consts.events.INTERACT, {}, block => block.matchesPosition(position));
  },
  codeBlock(position) {
    if(!auth.isLogged()) {
      return Promise.reject('Please login to be able to edit code');
    }

    if(position && voxel.hasPermission(position)) {
      events.emit(consts.events.EDIT_CODE, {
        type: 'block',
        map: position
      });
    } else {
      console.log('No permissions ¯\\_(ツ)_/¯');
    }
  },
  teleport(position) {
    playerSync.moveUser(position);
  }
};

import events from '../events';
import voxel from '../voxel';
import consts from '../constants';
import placement from './blockPlacement';
import auth from '../auth';
import playerSync from '../playerSync';

export default {
  async placeBlock(position, block) {
    if(position && voxel.hasPermission(position)) {
      await voxel.load(block);
      placement.setBlock(position, voxel.getById(block));
    } else {
      console.log('No permissions ¯\\_(ツ)_/¯');
    }
  },
  removeBlock(position) {
    if(position && voxel.hasPermission(position)) {
      placement.removeBlock(position);
    } else {
      console.log('No permissions ¯\\_(ツ)_/¯');
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

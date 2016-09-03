import voxel from '../voxel';
import events from '../events';
import consts from '../constants';

export default {
  removeBlock(position) {
    if(voxel.hasTestingCode(position)) {
      if(confirm('This block has local code that is not yet saved, delete anyway?')) {
        voxel.clearTestingCode(position);
      } else {
        return;
      }
    }

    voxel.engine.setBlock(position, 0);
    voxel.broadcastRemoveBlock(position);

    voxel.removeCode(position);

    events.emit(consts.events.REMOVE_ADJACENT, {}, block => block.adjacentTo(position));
  },
  setBlock(position, blockType) {
    if(voxel.hasTestingCode(position)) {
      if(confirm('This block has local code that is not yet saved, delete anyway?')) {
        voxel.clearTestingCode(position);
      } else {
        return;
      }
    }

    voxel.engine.setBlock(position, blockType.material);
    voxel.broadcastSetBlock(position, blockType.id);

    voxel.removeCode(position);
    if(blockType.code) {
      voxel.storeCode(position, blockType.id);
    }

    events.emit(consts.events.PLACE_ADJACENT, {}, block => block.adjacentTo(position));
  }
};

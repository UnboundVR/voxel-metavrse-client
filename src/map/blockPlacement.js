import voxel from '../voxel';
import events from '../events';
import consts from '../constants';

export default {
  removeBlock(position) {
    voxel.engine.setBlock(position, 0);
    voxel.broadcastRemoveBlock(position);

    voxel.removeCode(position);

    events.emit(consts.events.REMOVE_ADJACENT, {}, block => block.adjacentTo(position));
  },
  setBlock(position, blockType) {
    voxel.engine.setBlock(position, blockType.material);
    voxel.broadcastSetBlock(position, blockType.id);

    voxel.removeCode(position);
    if(blockType.code) {
      voxel.storeCode(position, blockType.id);
    } else {
      voxel.registerSimpleType(blockType);
    }

    events.emit(consts.events.PLACE_ADJACENT, {}, block => block.adjacentTo(position));
  }
};

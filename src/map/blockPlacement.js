import voxel from '../voxel';
import events from '../events';
import consts from '../constants';

function getAdjacent(pos) {
  var adj = [];

  adj.push([pos[0] + 1, pos[1], pos[2]]);
  adj.push([pos[0], pos[1] + 1, pos[2]]);
  adj.push([pos[0], pos[1], pos[2] + 1]);
  adj.push([pos[0] - 1, pos[1], pos[2]]);
  adj.push([pos[0], pos[1] - 1, pos[2]]);
  adj.push([pos[0], pos[1], pos[2] - 1]);

  return adj;
}

export default {
  removeBlock(position) {
    voxel.engine.setBlock(position, 0);
    voxel.broadcastRemoveBlock(position);

    voxel.removeCode(position);

    getAdjacent(position).forEach(pos => {
      events.emit(consts.events.REMOVE_ADJACENT, {}, {position: pos});
    });
  },
  setBlock(position, blockType) {
    voxel.engine.setBlock(position, blockType.material);
    voxel.broadcastSetBlock(position, blockType.id);

    voxel.removeCode(position);
    if(blockType.code) {
      voxel.storeCode(position, blockType.id);
    }

    getAdjacent(position).forEach(pos => {
      events.emit(consts.events.PLACE_ADJACENT, {}, {position: pos});
    });
  }
};

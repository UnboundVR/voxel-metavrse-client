import coding from '../coding';
import voxelEngine from '../voxelEngine';
import voxelClient from '../voxelClient';
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
    coding.removeCode(position);
    voxelEngine.clearBlock(position);
    voxelClient.clearBlock(position);

    getAdjacent(position).forEach(pos => {
      events.emit(consts.events.REMOVE_ADJACENT, {}, {position: pos});
    });
  },
  setBlock(position, blockType) {
    coding.removeCode(position);
    voxelEngine.createBlock(position, blockType);
    voxelClient.setBlock(position, blockType);

    getAdjacent(position).forEach(pos => {
      events.emit(consts.events.PLACE_ADJACENT, {}, {position: pos});
    });
  }
};

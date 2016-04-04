import consts from '../constants';
import voxelEngine from '../voxelEngine';
import coding from '../coding';

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
  canPlace(position) {
    var adjPositions = getAdjacent(position);
    var canPlace = true;

    adjPositions.forEach(adjPos => {
      canPlace = canPlace && coding.confirm(adjPos, consts.confirmableFunctions.PLACE_ADJACENT);
    });

    return canPlace;
  },
  canEdit(position) {
    if(voxelEngine.isOfType(position, 1)) { // TODO un-hardcode this, it basically  makes tiles unbreakable
      return false;
    }

    return coding.confirm(position, consts.confirmableFunctions.EDIT);
  }
};

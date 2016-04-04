import consts from '../constants';
import voxelEngine from '../voxelEngine';
import blocks from '../blocks';
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

function adjacentToTrollBlock(position) {
  var adj = getAdjacent(position);

  for(var i = 0; i < adj.length; i++) {
    var pos = adj[i];
    if(voxelEngine.isOfType(pos, blocks.types.TROLL.number)) {
      return true;
    }
  }

  return false;
}

export default {
  canPlace(position) {
    if(adjacentToTrollBlock(position)) {
      alert('problem?');
      return false;
    }

    var adjPositions = getAdjacent(position);
    var canPlace = true;

    adjPositions.forEach(adjPos => {
      canPlace = canPlace && coding.confirm(adjPos, consts.confirmableFunctions.PLACE_ADJACENT);
    });

    return canPlace;
  },
  canEdit(position) {
    if(voxelEngine.isOfType(position, blocks.types.TILE.number)) {
      return false;
    }

    if(voxelEngine.isOfType(position, blocks.types.TROLL.number)) {
      alert('the troll must go on');
      return false;
    }

    if(voxelEngine.isOfType(position, blocks.types.DOGE.number)) {
      alert('such indestructible');
      alert('wow');
      return false;
    }

    return coding.confirm(position, consts.confirmableFunctions.EDIT);
  }
};

import voxel from '../voxel';

export default {
  canPlace(position) {
    return true;
  },
  canEdit(position) {
    if(voxel.engine.getBlock(position) == 1) { // TODO un-hardcode this, it basically makes tiles unbreakable
      return false;
    }

    return true;
  }
};

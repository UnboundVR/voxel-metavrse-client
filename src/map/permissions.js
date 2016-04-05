import voxelEngine from '../voxelEngine';

export default {
  canPlace(position) {
    return true;
  },
  canEdit(position) {
    if(voxelEngine.isOfType(position, 1)) { // TODO un-hardcode this, it basically makes tiles unbreakable
      return false;
    }

    return true;
  }
};

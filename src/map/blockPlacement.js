import coding from '../coding';
import voxelEngine from '../voxelEngine';
import voxelClient from '../voxelClient';

export default {
  removeBlock(position) {
    coding.removeCode(position);
    voxelEngine.clearBlock(position);
    voxelClient.clearBlock(position);
  },
  setBlock(position, blockType) {
    coding.removeCode(position);
    voxelEngine.createBlock(position, blockType);
    voxelClient.setBlock(position, blockType);
  }
};

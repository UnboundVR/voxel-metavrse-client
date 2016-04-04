import coding from '../coding';
import voxelEngine from '../voxelEngine';
import blocks from '../blocks';

export default {
  codeBlock(position) {
    coding.editCode(position).then(() => {
      voxelEngine.setBlock(position, blocks.types.CODE.number);
    }, err => {
      alert(err);
    });
  }
};

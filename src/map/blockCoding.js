import coding from '../coding';
import voxelEngine from '../voxelEngine';

export default {
  codeBlock(position) {
    coding.editCode(position).then(() => {
      voxelEngine.setBlock(position, 2); // TODO unhardcode, we're setting this to the code block material
    }, err => {
      alert(err);
    });
  }
};

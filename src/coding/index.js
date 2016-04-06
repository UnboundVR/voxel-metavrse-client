import client  from './codingClient';
import executor  from './scriptExecutor';
import launchIde from './launchIde';
import voxelEngine from '../voxelEngine';

export default {
  init() {
    client.init();
  },
  editCode: launchIde,
  removeCode(position) {
    if(client.hasCode(position)) {
      client.removeCode(position);
      executor.remove(position);
    }
  },
  loadCode(blocks) {
    client.loadCode(blocks).then(blockObjs => {
      blockObjs.forEach(blockObj => {
        executor.create(blockObj.position, blockObj.codeObj.code);
        voxelEngine.setBlock(blockObj.position, 2);
      });
    });
  }
};

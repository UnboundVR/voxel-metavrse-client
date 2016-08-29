import client from './voxelClient';

export default {
  editChunkPermissions(pos) {
    let chunk = client.getChunkAtPosition(pos);
    console.log(chunk.position, chunk.owners)
  }
};

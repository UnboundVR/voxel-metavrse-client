import client from './voxelClient';
import requests from '../requests';
import auth from '../auth';

export default {
  async editChunkPermissions(pos) {
    if(!this.hasPermission(pos)) {
      alert('No permissions ¯\\_(ツ)_/¯');
      return;
    }

    let chunk = client.getChunkAtPosition(pos);

    let newOwnerId = prompt(`Existing owners of chunk ${chunk.id}: ${chunk.owners.join(',')} - add new one?`);

    if(newOwnerId) {
      await requests.requestToServer(`voxel/chunk/${chunk.id}/owners`, {
        body: JSON.stringify({
          newOwnerId
        }),
        method: 'POST',
        headers: auth.getAuthHeaders()
      });

      alert(`Added ${newOwnerId} to list of owners`);
    }
  },
  hasPermission(pos) {
    let chunk = client.getChunkAtPosition(pos);
    return chunk.owners.includes(auth.getUserId());
  }
};

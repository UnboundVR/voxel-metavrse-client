import auth from '../../auth';
import consts from '../../constants';
import executor from './scriptExecutor';
import types from '../blockTypes';
import voxelClient from '../voxelClient';
import instances from './instances';

async function processNew(position, blockType) {
  types.add(blockType);

  await executor.loadPrototype(blockType);

  instances.storeCode(position, blockType.id);
  voxelClient.setBlock(position, blockType.id);

  return blockType.code;
}

export default {
  async modify(position, code) {
    let response = await fetch(`${consts.SERVER_ADDRESS()}/inventory/blockType/${instances.getBlockTypeId(position)}`, {
      method: 'PUT',
      body: JSON.stringify({
        code
      }),
      headers: auth.getAuthHeaders()
    });
    let blockType = await response.json();

    return processNew(position, blockType);
  },
  async fork(position, code, name) {
    let blockType = await fetch(`${consts.SERVER_ADDRESS()}/inventory/blockType/${instances.getBlockTypeId(position)}/fork`, {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        material: this.voxelEngine.getBlock(position)
      }),
      headers: auth.getAuthHeaders()
    }).then(response => response.json());

    return await processNew(position, blockType);
  },
  async create(position, code, name) {
    let blockType = await fetch(`${consts.SERVER_ADDRESS()}/inventory/blockType`, {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        material: this.voxelEngine.getBlock(position)
      }),
      headers: auth.getAuthHeaders()
    }).then(response => response.json());

    return await processNew(position, blockType);
  }
};

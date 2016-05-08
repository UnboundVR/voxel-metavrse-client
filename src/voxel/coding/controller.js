import auth from '../../auth';
import github from './github';
import executor from './scriptExecutor';
import types from '../blockTypes';
import voxelClient from '../voxelClient';
import consts from '../../constants';

var blocksWithCode = {};

function resolveCode(blockType) {
  if(auth.isLogged()) {
    return fetch(`${consts.SERVER_ADDRESS()}/coding/${blockType.code.id}/${blockType.code.revision}`, {
      method: 'GET',
      headers: auth.getAuthHeaders()
    }).then(response => response.json());
  } else {
    return github.getGist(blockType.code.id, blockType.code.revision);
  }
}

async function processNewBlockType(position, blockType) {
  types.add(blockType);

  let codeObj = await resolveCode(blockType);
  blockType.code = codeObj;

  await executor.loadPrototype(blockType);
  storeCode(position, blockType.id);
  voxelClient.setBlock(position, blockType.id);

  return blockType.code;
}

function storeCode(position, id) {
  blocksWithCode[position] = id;
  executor.create(position, id);
}

export default {
  registerBlockType(blockType) {
    return resolveCode(blockType).then(codeObj => {
      blockType.code = codeObj;
      return executor.loadPrototype(blockType);
    });
  },
  getCode(position) {
    return types.getById(blocksWithCode[position]);
  },
  hasCode(position) {
    return !!blocksWithCode[position];
  },
  storeCode,
  removeCode(position) {
    delete blocksWithCode[position];
    executor.remove(position);
  },
  async modifyPrototype(position, code) {
    let blockType = await fetch(`${consts.SERVER_ADDRESS()}/inventory/blockType/${blocksWithCode[position]}`, {
      method: 'PUT',
      body: JSON.stringify({
        code
      }),
      headers: auth.getAuthHeaders()
    }).then(response => response.json());

    return processNewBlockType(blockType);
  },
  async forkPrototype(position, code, name) {
    let blockType = await fetch(`${consts.SERVER_ADDRESS()}/inventory/blockType/${blocksWithCode[position]}/fork`, {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        material: this.voxelEngine.getBlock(position)
      }),
      headers: auth.getAuthHeaders()
    }).then(response => response.json());

    return processNewBlockType(blockType);
  },
  async createNewPrototype(position, code, name) {
    let blockType = await fetch(`${consts.SERVER_ADDRESS()}/inventory/blockType`, {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        material: this.voxelEngine.getBlock(position)
      }),
      headers: auth.getAuthHeaders()
    }).then(response => response.json());

    return processNewBlockType(blockType);
  }
};

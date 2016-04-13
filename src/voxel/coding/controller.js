import auth from '../../auth';
import github from '../../github';
import executor from './scriptExecutor';
import prototypes from './prototypes';
import types from '../blockTypes';
import extend from 'extend';
import voxelClient from '../voxelClient';
import consts from '../../constants';

var blocksWithCode = {};

function resolveCode(blockType) {
  if(auth.isLogged()) {
    return Promise.resolve(blockType);
  } else {
    return github.getGist(blockType.code).then(function(codeObj) {
      var updatedType = extend({}, blockType);
      updatedType.code = codeObj;
      return updatedType;
    });
  }
}

function processNewBlockType(position, blockType) {
  types.add(blockType);
  prototypes.load(blockType);
  storeCode(position, blockType.id);
  voxelClient.setBlock(position, blockType.id);

  return blockType.code;
}

function storeCode(position, id) {
  blocksWithCode[position] = id;
  executor.create(position, prototypes.get(id));
}

export default {
  registerBlockType(blockType) {
    return resolveCode(blockType).then(prototypes.load);
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
  modifyPrototype(position, code) {
    return fetch(consts.SERVER_ADDRESS() + '/inventory/blockType/' + blocksWithCode[position], {
      method: 'PUT',
      body: JSON.stringify({
        code
      }),
      headers: auth.getAuthHeaders()
    }).then(response => response.json()).then(blockType => processNewBlockType(position, blockType));
  },
  forkPrototype(position, code, name) { // FIXME this shares lots of code with the method above!
    return fetch(consts.SERVER_ADDRESS() + '/inventory/blockType/' + blocksWithCode[position] + '/fork', {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        material: this.voxelEngine.getBlock(position)
      }),
      headers: auth.getAuthHeaders()
    }).then(response => response.json()).then(blockType => processNewBlockType(position, blockType));
  },
  createNewPrototype(position, code, name) {
    return fetch(consts.SERVER_ADDRESS() + '/inventory/blockType', {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        material: this.voxelEngine.getBlock(position)
      }),
      headers: auth.getAuthHeaders()
    }).then(response => response.json()).then(blockType => processNewBlockType(position, blockType));
  }
};

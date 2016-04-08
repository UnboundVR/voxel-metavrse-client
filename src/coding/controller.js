import auth from '../auth';
import github from './github';
import marketplace from '../marketplace';
import executor from './scriptExecutor';
import voxelClient from '../voxelClient';
import voxelEngine from '../voxelEngine';
import prototypes from './prototypes';
import extend from 'extend';

var blocksWithCode = {};

function resolveCodeMany(blockTypes) {
  return Promise.all(blockTypes.map(resolveCode));
}

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

export default {
  addBlockTypeCode(blockType) {
    return resolveCode(blockType).then(prototypes.loadPrototype);
  },
  init() {
    return resolveCodeMany(marketplace.getBlockTypes().filter(blockType => !!blockType.code)).then(blockTypes => {
      blockTypes.forEach(prototypes.loadPrototype);
    });
  },
  getCode(position) {
    return marketplace.getBlockTypeById(blocksWithCode[position]);
  },
  hasCode(position) {
    return !!blocksWithCode[position];
  },
  storeCode(position, id) {
    blocksWithCode[position] = id;
    executor.create(position, prototypes.getPrototype(id));
  },
  removeCode(position) {
    delete blocksWithCode[position];
    executor.remove(position);
  },
  modifyPrototype(position, code, codeId) {
    let request = new Request(process.env.SERVER_ADDRESS + '/marketplace/blockType/' + codeId, {
      method: 'PUT',
      body: JSON.stringify({
        code,
        id: codeId
      }),
      headers: auth.getAuthHeaders()
    });

    let self = this;
    return fetch(request).then(response => response.json()).then(() => {
      let blockType = self.getCode(position);
      blockType.code.code = code;
      prototypes.loadPrototype(blockType);
      voxelClient.setBlock(position, blockType.id, true);
      executor.remove(position);
      executor.create(position, prototypes.getPrototype(blockType.id));
    });
  },
  forkPrototype(position, code, name, codeId) { // FIXME this shares lots of code with the method above!
    let request = new Request(process.env.SERVER_ADDRESS + '/marketplace/blockType/' + codeId, {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        material: voxelEngine.getBlock(position)
      }),
      headers: auth.getAuthHeaders()
    });

    let self = this;
    return fetch(request).then(response => response.json()).then(blockType => {
      marketplace.addBlockType(blockType);
      prototypes.loadPrototype(blockType);
      self.storeCode(position, blockType.id);
      voxelClient.setBlock(position, blockType.id);

      return blockType.code;
    });
  },
  createNewPrototype(position, code, name) {
    let request = new Request(process.env.SERVER_ADDRESS + '/marketplace/blockType', {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        material: voxelEngine.getBlock(position)
      }),
      headers: auth.getAuthHeaders()
    });

    let self = this;
    return fetch(request).then(response => response.json()).then(blockType => {
      marketplace.addBlockType(blockType);
      prototypes.loadPrototype(blockType);
      self.storeCode(position, blockType.id);
      voxelClient.setBlock(position, blockType.id);

      return blockType.code;
    });
  }
};

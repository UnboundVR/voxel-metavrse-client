import auth from '../auth';
import github from './github';
import marketplace from '../marketplace';
import executor from './scriptExecutor';
import voxelClient from '../voxelClient';
import voxelEngine from '../voxelEngine';
import prototypes from './prototypes';
import extend from 'extend';

var blocksWithCode = {};

function resolveCode(blockTypes) {
  if(auth.isLogged()) {
    return Promise.resolve(blockTypes);
  } else {
    var promises = blockTypes.map(function(blockType) {
      return github.getGist(blockType.code).then(function(codeObj) {
        var res = extend({}, blockType);
        res.code = codeObj;
        return res;
      });
    });

    return Promise.all(promises);
  }
}

export default {
  init() {
    return resolveCode(marketplace.getBlockTypes().filter(blockType => !!blockType.code)).then(blockTypes => {
      blockTypes.forEach(prototypes.registerBlockType);
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
  modifyPrototype(position, code) {
    alert('not supported yet');
  },
  forkPrototype(position, code, name, codeId) { // FIXME this shares lots of code with the method above!
    let request = new Request(process.env.SERVER_ADDRESS + '/marketplace/blockType/' + codeId + '/fork?token=' + auth.getAccessToken(), {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        material: voxelEngine.getBlock(position)
      })
    });

    let self = this;
    return fetch(request).then(response => response.json()).then(blockType => {
      marketplace.addBlockType(blockType);
      prototypes.registerBlockType(blockType);
      self.storeCode(position, blockType.id);
      voxelClient.setBlock(position, blockType.id);

      return blockType.code;
    });
  },
  createNewPrototype(position, code, name) {
    let request = new Request(process.env.SERVER_ADDRESS + '/marketplace/blockType?token=' + auth.getAccessToken(), {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        material: voxelEngine.getBlock(position)
      })
    });

    let self = this;
    return fetch(request).then(response => response.json()).then(blockType => {
      marketplace.addBlockType(blockType);
      prototypes.registerBlockType(blockType);
      self.storeCode(position, blockType.id);
      voxelClient.setBlock(position, blockType.id);

      return blockType.code;
    });
  }
};

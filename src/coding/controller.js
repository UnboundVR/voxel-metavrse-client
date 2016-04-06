import auth from '../auth';
import github from './github';
import marketplace from '../marketplace';
import EventEmitter2 from 'eventemitter2';
import executor from './scriptExecutor';
import util from 'util';
import voxelClient from '../voxelClient';
import voxelEngine from '../voxelEngine';
import extend from 'extend';

var prototypes = {};
var codeObjects = {};
var blocksWithCode = {};

function buildPrototype(blockType) {
  var BlockPrototype = function(type) {
    this.blockType = type;
  };
  util.inherits(BlockPrototype, EventEmitter2.EventEmitter2);

  var proto = new BlockPrototype(blockType);
  (new Function(blockType.code.code).bind(proto))();

  return proto;
}

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

function registerBlockType(blockType) {
  prototypes[blockType.id] = buildPrototype(blockType);
  codeObjects[blockType.id] = blockType.code;
}

export default {
  init() {
    return resolveCode(marketplace.getBlockTypes().filter(blockType => !!blockType.code)).then(blockTypes => {
      blockTypes.forEach(registerBlockType);
    });
  },
  getCode(position) {
    return codeObjects[blocksWithCode[position]];
  },
  registerBlockType,
  hasCode(position) {
    return !!blocksWithCode[position];
  },
  storeCode(position, id) {
    blocksWithCode[position] = id;
    executor.create(position, prototypes[id]);
  },
  removeCode(position) {
    delete blocksWithCode[position];
    executor.remove(position);
  },
  modifyPrototype(position, code) {
    alert('not supported yet');
  },
  createNewPrototype(position, code) {
    let request = new Request(process.env.SERVER_ADDRESS + '/marketplace/blockType?token=' + auth.getAccessToken(), {
      method: 'POST',
      body: JSON.stringify({
        code: code,
        material: voxelEngine.getBlock(position)
      })
    });

    let self = this;
    return fetch(request).then(response => response.json()).then(blockType => {
      blockType.code = {
        id: blockType.code,
        code: code
      };
      marketplace.addBlockType(blockType);
      voxelClient.setBlock(position, blockType.id);
      registerBlockType(blockType);
      self.storeCode(position, blockType.id);

      return blockType.code;
    });
  }
};

import auth from '../auth';
import github from './github';
import marketplace from '../marketplace';
import EventEmitter2 from 'eventemitter2';
import executor from './scriptExecutor';
import util from 'util';

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

export default {
  init() {
    return resolveCode(marketplace.getBlockTypes().filter(blockType => !!blockType.code)).then(blockTypes => {
      blockTypes.forEach(blockType => {
        prototypes[blockType.id] = buildPrototype(blockType);
        codeObjects[blockType.id] = blockType.code;
      });
    });
  },
  getCode(position) {
    return codeObjects[blocksWithCode[position]];
  },
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
  modifyPrototype(id, code) {
    alert('not supported yet');
  },
  createNewPrototype(code) {
    alert('not supported yet');
  }
};

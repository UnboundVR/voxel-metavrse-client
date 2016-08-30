import scripts from './scripts';
import types from '../blockTypes';
import testing from './testing';

var blocksWithCode = {};

export default {
  getCode(position) {
    let blockType = types.getById(blocksWithCode[position]);
    let code = scripts.getCode(blockType.id);

    return {
      blockType,
      code
    };
  },
  getBlockTypeId(position){
    return blocksWithCode[position];
  },
  hasCode(position) {
    return !!blocksWithCode[position];
  },
  storeCode(position, id) {
    blocksWithCode[position] = id;
    scripts.createInstance(position, id);

    if(testing.hasTestingCode(position)) {
      let blockType = types.getById(id);
      testing.activateTestingCode(position, blockType);
    }
  },
  removeCode(position) {
    delete blocksWithCode[position];
    scripts.removeInstance(position);
  }
};

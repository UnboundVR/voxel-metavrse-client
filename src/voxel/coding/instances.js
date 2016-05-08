import executor from './scriptExecutor';
import types from '../blockTypes';

var blocksWithCode = {};

export default {
  getCode(position) {
    let blockType = types.getById(blocksWithCode[position]);
    let code = executor.getCode(blockType.id);

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
    executor.create(position, id);
  },
  removeCode(position) {
    delete blocksWithCode[position];
    executor.remove(position);
  }
};

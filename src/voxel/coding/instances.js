import scripts from './scripts';
import types from '../blockTypes';
import testing from './testing';
import consts from '../../constants';
import events from '../../events';

var blocksWithCode = {};

export default {
  init() {
    events.on(consts.events.RELOAD_CODE, position => {
      console.log(position, typeof position);
      if(this.hasCode(position)) {
        let blockTypeId = this.getBlockTypeId(position);
        scripts.createInstance(position, blockTypeId);
        console.log(`Code of block of type ${blockTypeId} at ${position} reset!`);
      }
    });
  },
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

    // if we had existing testing code brought from local storage but it's not activated yet, activate now
    if(testing.hasTestingCode(position) && !testing.hasActivatedTestingCode(position)) {
      let blockType = types.getById(id);
      testing.activateTestingCode(position, blockType);
    }
  },
  removeCode(position) {
    delete blocksWithCode[position];
    scripts.removeInstance(position);
  }
};

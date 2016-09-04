import scripts from './scripts';
import types from '../blockTypes';
import testing from './testing';
import consts from '../../constants';
import events from '../../events';

var blocksWithCode = {};

export default {
  init() {
    events.on(consts.events.RELOAD_CODE, payload => {
      let {position, type} = payload;

      if(type == 'block') {

        if(this.hasCode(position)) {
          let blockTypeId = this.getBlockTypeId(position);
          scripts.createInstance(position, blockTypeId);
          console.log(`Code of block of type ${blockTypeId} at ${position} reset!`);
        } else {
          scripts.removeInstance(position);
        }
      }
    });
  },
  getCode(position) {
    let blockType = types.getById(blocksWithCode[position.join('|')]);
    let code = scripts.getCode(blockType.id);

    return {
      blockType,
      code
    };
  },
  getBlockTypeId(position){
    return blocksWithCode[position.join('|')];
  },
  hasCode(position) {
    return !!blocksWithCode[position.join('|')];
  },
  storeCode(position, id) {
    blocksWithCode[position.join('|')] = id;

    // if we have testing code we should not instantiate default behavior
    if(!testing.hasTestingCode(position)) {
      scripts.createInstance(position, id);
    }
  },
  removeCode(position) {
    delete blocksWithCode[position.join('|')];
    scripts.removeInstance(position);
  }
};

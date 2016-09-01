import consts from '../../constants';
import events from '../../events';

let testingItems = {};

export default {
  init() {
    events.on(consts.events.TEST_CODE, async data => {
      let {type, toolbar, code, item} = data;

      if(type == 'item') {
        console.log(`Testing item at #${toolbar}`);
      }
    });
  }
};

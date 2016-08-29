import consts from '../../constants';
import events from '../../events';
import scripts from './scripts';

let testingBlocks = {};

export default {
  init() {
    events.on(consts.events.TEST_CODE, async data => {
      let {type, position, code, item} = data;

      if(type == 'block') {
        try {
          let classId = await scripts.loadTestClass(position, code);
          scripts.testCode(classId, position, item);
          testingBlocks[position.join('|')] = code;
        } catch(err) {
          console.log('Error executing code', err);
        }
      }
    });

    events.on(consts.events.CODE_UPDATED, async payload => {
      if(payload.map) {
        this.clearTestingCode(payload.map);
      }
    });
  },
  getTestingCode(position) {
    return testingBlocks[position.join('|')];
  },
  clearTestingCode(position) {
    delete testingBlocks[position.join('|')];
  }
};

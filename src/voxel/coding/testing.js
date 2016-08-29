import consts from '../../constants';
import events from '../../events';
import scripts from './scripts';

export default {
  init() {
    events.on(consts.events.TEST_CODE, async data => {
      let {type, position, code, item} = data;

      if(type == 'block') {
        let classId = await scripts.loadTestClass(position, code);
        scripts.testCode(classId, position, item);
      }
    });
  }
};

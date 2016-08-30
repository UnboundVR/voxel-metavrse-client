import consts from '../../constants';
import events from '../../events';
import scripts from './scripts';

let testingBlocks;

export default {
  init() {
    testingBlocks = JSON.parse(localStorage.getItem('testingBlocks') || '{}');

    events.on(consts.events.TEST_CODE, async data => {
      let {type, position, code, item} = data;

      if(type == 'block') {
        await this.testCode(position, code, item);
      }
    });

    events.on(consts.events.CODE_UPDATED, payload => {
      if(payload.map) {
        this.clearTestingCode(payload.map);
      }
    });

    events.on(consts.events.WIPE_TESTING_CODE, () => {
      for(let key in testingBlocks) {
        let position = key.split('|');
        events.emit(consts.events.RELOAD_CODE, position);
      }

      let testingBlocksAmount = Object.keys(testingBlocks).length;

      testingBlocks = {};
      localStorage.setItem('testingBlocks', JSON.stringify(testingBlocks));

      console.log(`${testingBlocksAmount} blocks with testing code reset to default`);
    });
  },
  async testCode(position, code, item) {
    let oldCode = this.getTestingCode(position);

    try {
      this.storeTestingCode(position, code);
      await this.activateTestingCode(position, item);
      localStorage.setItem('testingBlocks', JSON.stringify(testingBlocks));
    } catch(err) {
      console.log('Error executing code', err);
      this.storeTestingCode(position, oldCode);
    }
  },
  getTestingCode(position) {
    return testingBlocks[position.join('|')];
  },
  clearTestingCode(position) {
    delete testingBlocks[position.join('|')];
  },
  storeTestingCode(position, code) {
    testingBlocks[position.join('|')] = code;
  },
  hasTestingCode(position) {
    return !!this.getTestingCode(position);
  },
  async activateTestingCode(position, item) {
    let classId = await scripts.loadTestClass(position, this.getTestingCode(position));
    scripts.testCode(classId, position, item);
  }
};
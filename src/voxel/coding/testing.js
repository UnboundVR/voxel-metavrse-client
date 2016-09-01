import consts from '../../constants';
import events from '../../events';
import scripts from './scripts';

let testingBlocks;
let activatedTestBlocks = {};

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
      if(payload.map && this.hasTestingCode(payload.map)) {
        this.clearTestingCode(payload.map);
      }
    });

    events.on(consts.events.WIPE_TESTING_CODE, () => {
      let amount = Object.keys(testingBlocks).length;

      if(amount == 0) {
        console.log('No testing blocks to clear.');
        return;
      }

      if(confirm(`Reset ${amount} blocks with testing code?`)) {
        for(let key in testingBlocks) {
          let position = key.split(',').map(coord => parseInt(coord));
          events.emit(consts.events.RELOAD_CODE, position);
        }

        let testingBlocksAmount = Object.keys(testingBlocks).length;

        testingBlocks = {};
        localStorage.setItem('testingBlocks', JSON.stringify(testingBlocks));

        console.log(`${testingBlocksAmount} blocks with testing code reset to default`);
      }
    });
  },
  async testCode(position, code, item) {
    let oldCode = this.getTestingCode(position);

    try {
      this.storeTestingCode(position, code);
      await this.activateTestingCode(position, item);
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
    localStorage.setItem('testingBlocks', JSON.stringify(testingBlocks));

    activatedTestBlocks[position.join('|')] = false;
  },
  storeTestingCode(position, code) {
    testingBlocks[position.join('|')] = code;
    localStorage.setItem('testingBlocks', JSON.stringify(testingBlocks));
  },
  hasTestingCode(position) {
    return !!this.getTestingCode(position);
  },
  async activateTestingCode(position, item) {
    let classId = await scripts.loadTestClass(position, this.getTestingCode(position));
    scripts.testCode(classId, position, item);

    activatedTestBlocks[position.join('|')] = true;
  },
  hasActivatedTestingCode(position) {
    return !!activatedTestBlocks[position.join('|')];
  }
};

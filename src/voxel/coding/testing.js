import consts from '../../constants';
import events from '../../events';
import scripts from './scripts';
import types from '../blockTypes';
import voxelCoordsHelper from '../voxelCoordsHelper';

let testingBlocks;
let positionIdMapping;

const LOCAL_STORAGE_TESTING_BLOCKS = 'testingBlocks';
const LOCAL_STORAGE_POSITION_ID_MAPPING = 'testingCodePositionIdMapping';

export default {
  init() {
    testingBlocks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TESTING_BLOCKS) || '{}');
    positionIdMapping = JSON.parse(localStorage.getItem(LOCAL_STORAGE_POSITION_ID_MAPPING) || '{}');

    events.on(consts.events.LOAD_TESTING_CODE, chunk => {
      // console.log(`Loading testing code in chunk at ${chunk.position.join('|')}`);
      for (let pos of Object.keys(positionIdMapping)) {
        let position = pos.split('|').map(coord => parseInt(coord));
        if(voxelCoordsHelper.isInside(chunk, position)) {
          // console.log(`${position.join('|')} is inside chunk at ${chunk.position.join('|')}`);
          let flatLocalPosition = voxelCoordsHelper.getFlatLocalPosition(chunk, position);
          let id = chunk.voxels[flatLocalPosition];
          this._verifyPosition(position, id);
        }
      }
    });

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
        let testingBlocksAmount = Object.keys(testingBlocks).length;

        for(let key in testingBlocks) {
          let position = key.split('|').map(coord => parseInt(coord));
          this.clearTestingCode(position);
        }

        console.log(`${testingBlocksAmount} blocks with testing code reset to default`);
      }
    });
  },
  async testCode(position, code, item) {
    let oldCode = this.getTestingCode(position);

    try {
      this._storeTestingCode(position, code);
      await this._activateTestingCode(position, item);
      positionIdMapping[position.join('|')] = item.id;
      localStorage.setItem(LOCAL_STORAGE_POSITION_ID_MAPPING, JSON.stringify(positionIdMapping));
    } catch(err) {
      console.log('Error executing code', err);
      this._storeTestingCode(position, oldCode);
    }
  },
  getTestingCode(position) {
    return testingBlocks[position.join('|')];
  },
  clearTestingCode(position) {
    delete testingBlocks[position.join('|')];
    localStorage.setItem(LOCAL_STORAGE_TESTING_BLOCKS, JSON.stringify(testingBlocks));

    delete positionIdMapping[position.join('|')];
    localStorage.setItem(LOCAL_STORAGE_POSITION_ID_MAPPING, JSON.stringify(positionIdMapping));

    events.emit(consts.events.RELOAD_CODE, position);
  },
  hasTestingCode(position) {
    return !!this.getTestingCode(position);
  },
  async _activateTestingCode(position, item) {
    let classId = await scripts.loadTestClass(position, this.getTestingCode(position));
    scripts.testCode(classId, position, item);
  },
  _storeTestingCode(position, code) {
    testingBlocks[position.join('|')] = code;
    localStorage.setItem(LOCAL_STORAGE_TESTING_BLOCKS, JSON.stringify(testingBlocks));
  },
  async _verifyPosition(position, id) {
    let expectedId = positionIdMapping[position.join('|')];

    if(id != expectedId) {
      let localCode = this.getTestingCode(position);
      console.log(`Block at position ${position.join('|')} with local code should be of type ${expectedId} but it's ${id}. We're deleting the local code:\n ${localCode}`);
      this.clearTestingCode(position);
    } else {
      let item = types.getById(id);
      await this._activateTestingCode(position, item);
    }
  }
};

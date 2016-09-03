import consts from '../../constants';
import events from '../../events';
import scripts from './scripts';

let testingItems;
let toolbarIdMapping;

const LOCAL_STORAGE_TESTING_ITEMS = 'testingItems';
const LOCAL_STORAGE_TOOLBAR_ID_MAPPING = 'testingCodeToolbarIdMapping';

export default {
  async init() {
    testingItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TESTING_ITEMS) || '{}');
    toolbarIdMapping = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TOOLBAR_ID_MAPPING) || '{}');

    for(let key in testingItems) {
      let toolbar = parseInt(key);
      // We're passing null as the last param (item) because when this starts, the user has the "interact" toolbar item selected, so it will never have other item selected
      await scripts.loadTestClass(toolbar, testingItems[key], null);
    }

    events.on(consts.events.TEST_CODE, async data => {
      let {type, toolbar, code, item} = data;

      if(type == 'item') {
        console.log(`Testing item at #${toolbar}`);
        await this.testCode(toolbar, code, item);
      }
    });

    events.on(consts.events.CODE_UPDATED, payload => {
      if(payload.toolbar !== undefined && this.hasTestingCode(payload.toolbar)) {
        this.clearTestingCode(payload.toolbar);
      }
    });

    events.on(consts.events.WIPE_TESTING_CODE, payload => {
      if(payload.toolbar !== undefined) {
        this.clearTestingCode(payload.toolbar);
      } else if(payload.all) {
        let amount = Object.keys(testingItems).length;

        if(amount == 0) {
          console.log('No testing items to clear.');
          return;
        }

        if(confirm(`Reset ${amount} items with testing code?`)) {
          for(let key in testingItems) {
            let toolbar = parseInt(key);
            this.clearTestingCode(toolbar);
          }

          console.log(`${amount} blocks with testing code reset to default`);
        }
      }
    });
  },
  async testCode(toolbar, code, item) {
    let oldCode = this.getTestingCode(toolbar);

    try {
      this._storeTestingCode(toolbar, code);
      await scripts.loadTestClass(toolbar, code, item);

      toolbarIdMapping[toolbar] = item.id;
      localStorage.setItem(LOCAL_STORAGE_TOOLBAR_ID_MAPPING, JSON.stringify(toolbarIdMapping));
    } catch(err) {
      console.log('Error executing code', err);
      this._storeTestingCode(toolbar, oldCode);
    }
  },
  getTestingCode(toolbar) {
    return testingItems[toolbar];
  },
  hasTestingCode(toolbar) {
    return !!this.getTestingCode(toolbar);
  },
  clearTestingCode(toolbar) {
    let itemTypeId = toolbarIdMapping[toolbar];

    delete testingItems[toolbar];
    localStorage.setItem(LOCAL_STORAGE_TESTING_ITEMS, JSON.stringify(testingItems));

    delete toolbarIdMapping[toolbar];
    localStorage.setItem(LOCAL_STORAGE_TOOLBAR_ID_MAPPING, JSON.stringify(toolbarIdMapping));

    events.emit(consts.events.RELOAD_CODE, {type: 'item', toolbar, itemTypeId});
  },
  _storeTestingCode(toolbar, code) {
    testingItems[toolbar] = code;
    localStorage.setItem(LOCAL_STORAGE_TESTING_ITEMS, JSON.stringify(testingItems));
  }
};

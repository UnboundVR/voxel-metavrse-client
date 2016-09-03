import events from '../../events';
import consts from '../../constants';
import launchIde from './launchIde';
import types from '../itemTypes';
import testing from './testing';
import scripts from './scripts';

export default {
  async init() {
    await testing.init();

    events.on(consts.events.RELOAD_CODE, payload => {
      let {toolbar, type, itemTypeId} = payload;

      if(type == 'item') {
        if(scripts.getCurrentToolbar() == toolbar) {
          scripts.deactivate();
          let item = types.getById(itemTypeId);
          scripts.activate(item, toolbar);
          console.log(`Item at #${toolbar} reset!`);
        }
      }
    });

    events.on(consts.events.EDIT_CODE, async payload => {
      if(payload.type == 'item') {
        let itemId = payload.id;

        if(!itemId) {
          launchIde.create(payload.toolbar);
        } else {
          await types.load(itemId);
          let item = types.getById(itemId);
          launchIde.edit(item, this.get(itemId), payload.toolbar);
        }
      }
    });
  },
  async registerItemType(itemType) {
    await scripts.registerItemType(itemType);
  },
  activate(item, toolbarPosition) {
    if(testing.hasTestingCode(toolbarPosition)) {
      scripts.testCode(item, toolbarPosition);
    } else {
      scripts.activate(item, toolbarPosition);
    }
  },
  get(id) {
    return scripts.get(id);
  },
  deactivate() {
    scripts.deactivate();
  },
  execute(position) {
    scripts.execute(position);
  },
  hasTestingCode(toolbarPosition) {
    return testing.hasTestingCode(toolbarPosition);
  }
};

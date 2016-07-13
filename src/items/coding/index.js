import coding from '../../coding';
import ScriptExecutor from 'script-executor';
import events from '../../events';
import consts from '../../constants';
import extend from 'extend';
import world from '../../map';
import launchIde from './launchIde';
import types from '../itemTypes';

var scriptExecutor = new ScriptExecutor();

scriptExecutor.wireEvents(events, [
  consts.events.HOVER,
  consts.events.LEAVE
]);

var classes = {};
var activeItem = null;

export default {
  init() {
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
    let codeObj = await coding.get(itemType.code.id, itemType.code.revision);
    let classId = `${codeObj.id}-${codeObj.revision.id}`;
    let code = codeObj.code;
    let name = itemType.name;

    console.log(`Loading code of item ${name} with ID ${classId}`);
    await scriptExecutor.loadClass(classId, code);

    classes[itemType.id] = {itemType, code: codeObj};
    console.log(`Code of item ${name} loaded`);
  },
  get(id) {
    return classes[id].code;
  },
  activate(item) {
    let codeObj = classes[item.id].code;
    let classId = `${codeObj.id}-${codeObj.revision.id}`;

    let metadata = extend({}, item, {
      matchesPosition: () => true
    });

    scriptExecutor.createInstance(item.id, classId, {api: world, metadata});
    activeItem = item.id;
  },
  deactivate() {
    if(activeItem) {
      let item = scriptExecutor.getInstance(activeItem);
      item.onDestroy && item.onDestroy();
      scriptExecutor.removeInstance(activeItem);
      activeItem = null;
    }
  },
  execute(position) {
    if(activeItem) {
      let item = scriptExecutor.getInstance(activeItem);
      item.onExecute && item.onExecute(position);
    }
  }
};

import coding from '../../coding';
import ScriptExecutor from 'script-executor';
import events from '../../events';
import consts from '../../constants';
import extend from 'extend';
import world from '../../map';

var scriptExecutor = new ScriptExecutor();

scriptExecutor.wireEvents(events, [
  consts.events.HOVER,
  consts.events.LEAVE
]);

var classes = {};
var activeItem = null;

export default {
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
  edit(item) {
    alert(`Editing code of item ${item.name}`);
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

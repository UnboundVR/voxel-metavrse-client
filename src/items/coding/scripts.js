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

let classes = {};
let currentToolbar;

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
  async loadTestClass(toolbar, code, item) {
    let classId = `itemTesting-${toolbar}`;
    await scriptExecutor.loadClass(classId, code);

    if(currentToolbar == toolbar) {
      this.testCode(item, toolbar);
    }
  },
  testCode(item, toolbar) {
    currentToolbar = toolbar;

    this.deactivate(toolbar);

    let metadata = extend({}, item, {
      matchesPosition: () => true
    });

    let classId = `itemTesting-${toolbar}`;
    scriptExecutor.createInstance(toolbar, classId, {api: world, metadata});
  },
  get(id) {
    return classes[id].code;
  },
  activate(item, toolbar) {
    currentToolbar = toolbar;

    let codeObj = classes[item.id].code;
    let classId = `${codeObj.id}-${codeObj.revision.id}`;

    let metadata = extend({}, item, {
      matchesPosition: () => true
    });

    scriptExecutor.createInstance(toolbar, classId, {api: world, metadata});
  },
  deactivate() {
    let item = scriptExecutor.getInstance(currentToolbar);

    if(item) {
      item.onDestroy && item.onDestroy();
      scriptExecutor.removeInstance(currentToolbar);
    }
  },
  execute(position) {
    let item = scriptExecutor.getInstance(currentToolbar);

    if(item) {
      item.onExecute && item.onExecute(position);
    }
  }
};

import coding from '../../coding';
import scriptExecutor from 'script-executor';

var classes = {};

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
  }
};

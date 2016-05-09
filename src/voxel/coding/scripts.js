import events from '../../events';
import consts from '../../constants';
import map from '../../map';
import Block from '../block';
import scriptExecutor from 'script-executor';
import coding from '../../coding';

var classes = {};

scriptExecutor.wireEvents(events, [
  consts.events.HOVER,
  consts.events.LEAVE,
  consts.events.INTERACT,
  consts.events.PLACE_ADJACENT,
  consts.events.REMOVE_ADJACENT
]);

function getId(pos) {
  return pos.join('|');
}

async function loadClass(blockType) {
  let codeObj = await coding.get(blockType.code.id, blockType.code.revision);
  let name = blockType.name;

  try {
    let id = codeObj.id;
    let code = codeObj.code;
    console.log(`Loading code for ${name} with ID ${id}`);
    await scriptExecutor.loadClass(id, code);

    classes[blockType.id] = {blockType, code: codeObj};
    console.log(`Code for ${name} loaded`);
  } catch(e) {
    console.log(`Error loading code for ${name}`, e);
    throw e;
  }
}

function createInstance(position, blockTypeId) {
  removeInstance(position);

  let $class = classes[blockTypeId];

  if(!$class) {
    throw new Error('Script does not exist');
  }

  let classId = $class.code.id;
  let blockType = $class.blockType;
  let block = new Block(position, blockType);
  let instanceId = getId(position);

  scriptExecutor.createInstance(instanceId, classId, {metadata: block, api: map});
}

function removeInstance(position) {
  let id = getId(position);

  let instance = scriptExecutor.getInstance(id);
  if(instance && instance.onDestroy) {
    instance.onDestroy();
  }

  scriptExecutor.removeInstance(id);
}

function getCode(id) {
  return classes[id].code;
}

export default {
  createInstance,
  removeInstance,
  getCode,
  loadClass
};

import events from '../../events';
import consts from '../../constants';
import map from '../../map';
import Block from '../block';
import scriptExecutor from 'script-executor';
import resolveCode from './resolveCode';

var prototypes = {};

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

async function loadPrototype(blockType) {
  let codeObj = await resolveCode(blockType.code);
  let name = blockType.name;

  try {
    let id = codeObj.id;
    let code = codeObj.code;
    console.log(`Loading code for ${name} with ID ${id}`);
    await scriptExecutor.loadClass(id, code);

    prototypes[blockType.id] = {blockType, code: codeObj};
    console.log(`Code for ${name} loaded`);
  } catch(e) {
    console.log(`Error loading code for ${name}`, e);
    throw e;
  }
}

function create(position, prototypeId) {
  remove(position);

  let prototype = prototypes[prototypeId];

  if(!prototype) {
    throw new Error('Prototype does not exist');
  }

  let classId = prototype.code.id;
  let blockType = prototype.blockType;
  let block = new Block(position, blockType);
  let instanceId = getId(position);

  scriptExecutor.createInstance(instanceId, classId, {metadata: block, api: map});
}

function remove(position) {
  let id = getId(position);

  let instance = scriptExecutor.getInstance(id);
  if(instance && instance.onDestroy) {
    instance.onDestroy();
  }

  scriptExecutor.removeInstance(id);
}

function getCode(id) {
  return prototypes[id].code;
}

export default {
  create,
  remove,
  getCode,
  loadPrototype
};

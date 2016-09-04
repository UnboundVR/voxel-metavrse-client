import events from '../../events';
import consts from '../../constants';
import world from '../../map';
import Block from '../block';
import ScriptExecutor from 'script-executor';
import coding from '../../coding';
import uuid from 'node-uuid';
import chat from '../../chat';

let classes = {};
let scriptExecutor = new ScriptExecutor();

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

function getClassId(codeObj) {
  return `${codeObj.id}-${codeObj.revision.id}`;
}

function getTestClassId(position) {
  let instanceId = getId(position);
  return `temp-${instanceId}-${uuid.v4()}`;
}

async function loadTestClass(position, code) {
  let id = getTestClassId(position);
  await scriptExecutor.loadClass(id, code);

  return id;
}

function testCode(classId, position, blockType) {
  removeInstance(position);

  let block = new Block(position, blockType);
  scriptExecutor.createInstance(getId(position), classId, {metadata: block, api: world});
}

async function loadClass(blockType) {
  let codeObj = await coding.get(blockType.code.id, blockType.code.revision);
  let name = blockType.name;

  let classId = getClassId(codeObj);
  let code = codeObj.code;

  chat.debug(`Loading code of block ${name} with ID ${classId}`);
  await scriptExecutor.loadClass(classId, code);

  classes[blockType.id] = {blockType, code: codeObj};
  chat.debug(`Code of block ${name} loaded`);
}

function createInstance(position, blockTypeId) {
  removeInstance(position);

  let $class = classes[blockTypeId];

  if(!$class) {
    throw new Error('Script does not exist');
  }

  let classId = getClassId($class.code);
  let blockType = $class.blockType;
  let block = new Block(position, blockType);
  let instanceId = getId(position);

  scriptExecutor.createInstance(instanceId, classId, {metadata: block, api: world});
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
  testCode,
  loadTestClass,
  createInstance,
  removeInstance,
  getCode,
  loadClass
};

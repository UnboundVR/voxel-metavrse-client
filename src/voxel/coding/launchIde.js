import ide from '../../ide';
import classes from './classes';
import events from '../../events';
import consts from '../../constants';

async function openNew(data) {
  let code =
`export default class SuchBlockBehavior {
  constructor(world, block) {
    this.world = world;
    this.block = block;
  }

  onInteract() {
    console.log('such interact. wow.');
  }

  onHover() {
    console.log('very hover');
  }

  onDestroy() {
    console.log(':(');
  }
}`; // TODO bring from server or something

  let material = data.material || 2; // default material for newly created items is "code"
  try {
    let result = await ide.open({
      position: data.position,
      toolbar: data.toolbar,
      code,
      item: data.blockType,
      type: 'block',
      simpleBlock: true
    });

    let newBlockType = await classes.create(data.position, material, result.value, result.name);
    console.log('New code was created correctly with ID: ' + newBlockType.code.id);

    events.emit(consts.events.CODE_UPDATED, {
      operation: consts.coding.OPERATIONS.CREATE,
      newId: newBlockType.id,
      map: data.position,
      toolbar: data.toolbar,
      type: 'block'
    });
  } catch(err) {
    console.log('Error storing code: ' + err);
  }
}

async function openExisting(data) {
  let result = await ide.open({
    position: data.position,
    toolbar: data.toolbar,
    item: data.blockType,
    code: data.code,
    type: 'block',
    simpleBlock: false
  });

  try {
    let operation, newBlockType;
    if(result.name) {
      operation = consts.coding.OPERATIONS.FORK;
      newBlockType = await classes.fork(data.position, data.blockType, result.value, result.name);
      console.log(`Existing code was forked with ID ${newBlockType.code.id}`);
    } else {
      operation = consts.coding.OPERATIONS.UPDATE;
      newBlockType = await classes.modify(data.position, data.blockType, result.value);
      console.log('Existing code was updated correctly');
      data.blockType.newerVersion = newBlockType.id;
    }

    events.emit(consts.events.CODE_UPDATED, {
      operation,
      newId: newBlockType.id,
      oldId: data.blockType.id,
      map: data.position,
      toolbar: data.toolbar,
      type: 'block'
    });
  } catch(err) {
    console.log('Error storing code: ' + err);
  }
}

export default {
  openExisting,
  openNew
};

import ide from '../../ide';
import classes from './classes';
import events from '../../events';
import consts from '../../constants';

var openNew = function(data) {
  var code =
`export default class SuchBlockBehavior {
  constructor(world, block) {
    this.world = world;
    this.block = block;
  }

  onInteract() {
    alert('such interact. wow.');
  }

  onHover() {
    console.log('very hover');
  }

  onDestroy() {
    console.log(':(');
  }
}`; // TODO bring from server or something

  let material = data.material || 2; // default material for newly created items is "code"

  return ide.open({position: data.position, code}).then(result => {
    return classes.create(data.position, material, result.value, result.name).then(newBlockType => {
      alert('New code was created correctly with ID: ' + newBlockType.code.id);
      events.emit(consts.events.CODE_UPDATED, {
        operation: consts.coding.OPERATIONS.CREATE,
        newId: newBlockType.id,
        map: data.position,
        toolbar: data.toolbar,
        type: 'block'
      });
    }, err => {
      alert('Error storing code: ' + err);
    });
  });
};

var openExisting = function(data) {
  return ide.open({position: data.position, item: data.blockType, code: data.code}).then(result => {
    if(result.name) {
      return classes.fork(data.position, data.blockType, result.value, result.name).then(newBlockType => {
        alert('Existing code was forked with ID: ' + newBlockType.code.id);
        events.emit(consts.events.CODE_UPDATED, {
          operation: consts.coding.OPERATIONS.FORK,
          newId: newBlockType.id,
          oldId: data.blockType.id,
          map: data.position,
          toolbar: data.toolbar,
          type: 'block'
        });
      }, err => {
        alert('Error storing code: ' + err);
      });
    } else {
      return classes.modify(data.position, data.blockType, result.value).then((newBlockType) => {
        alert('Existing code was updated correctly');
        events.emit(consts.events.CODE_UPDATED, {
          operation: consts.coding.OPERATIONS.UPDATE,
          newId: newBlockType.id,
          oldId: data.blockType.id,
          map: data.position,
          toolbar: data.toolbar,
          type: 'block'
        });
      }, err => {
        alert('Error storing code: ' + err);
      });
    }
  });
};

export default {
  openExisting,
  openNew
};

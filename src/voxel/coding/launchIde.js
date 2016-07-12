import ide from '../../ide';
import classes from './classes';
import instances from './instances';
import auth from '../../auth';
import events from '../../events';
import consts from '../../constants';

var openNew = function(position) {
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

  return ide.open({position, code}).then(data => {
    return classes.create(position, data.value, data.name).then(newBlockType => {
      alert('New code was created correctly with ID: ' + newBlockType.code.id);
      events.emit(consts.events.CODE_UPDATED, {
        operation: consts.coding.OPERATIONS.CREATE,
        newId: newBlockType.id,
        map: position,
        type: 'block'
      });
    }, err => {
      alert('Error storing code: ' + err);
    });
  });
};

var openExisting = function(position, data) {
  return ide.open({position, item: data.blockType, code: data.code}).then(result => {
    if(result.name) {
      return classes.fork(position, result.value, result.name).then(newBlockType => {
        alert('Existing code was forked with ID: ' + newBlockType.code.id);
        events.emit(consts.events.CODE_UPDATED, {
          operation: consts.coding.OPERATIONS.FORK,
          newId: newBlockType.id,
          oldId: data.blockType.id,
          map: position,
          type: 'block'
        });
      }, err => {
        alert('Error storing code: ' + err);
      });
    } else {
      return classes.modify(position, result.value).then((newBlockType) => {
        alert('Existing code was updated correctly');
        events.emit(consts.events.CODE_UPDATED, {
          operation: consts.coding.OPERATIONS.UPDATE,
          newId: newBlockType.id,
          oldId: data.blockType.id,
          map: position,
          type: 'block'
        });
      }, err => {
        alert('Error storing code: ' + err);
      });
    }
  });
};

export default function(position) {
  if(!auth.isLogged()) {
    return Promise.reject('Please login to be able to edit code');
  }

  if(instances.hasCode(position)) {
    return openExisting(position, instances.getCode(position));
  } else {
    return openNew(position);
  }
}

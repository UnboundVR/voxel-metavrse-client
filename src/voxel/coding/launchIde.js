import ide from '../../ide';
import classes from './classes';
import instances from './instances';
import auth from '../../auth';

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
    return classes.create(position, data.value, data.name).then(codeObj => {
      alert('New code was created correctly with ID: ' + codeObj.id);
    }, err => {
      alert('Error storing code: ' + err);
    });
  });
};

var openExisting = function(position, data) {
  return ide.open({position, blockType: data.blockType, code: data.code}).then(data => {
    if(data.name) {
      return classes.fork(position, data.value, data.name).then((codeObj) => {
        alert('Existing code was forked with ID: ' + codeObj.id);
      }, err => {
        alert('Error storing code: ' + err);
      });
    } else {
      return classes.modify(position, data.value).then(() => {
        alert('Existing code was updated correctly');
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

import ide from '../../ide';
import prototypes from './prototypes';
import instances from './instances';
import auth from '../../auth';

var openNew = function(position) {
  var code = "function SuchBlockBehavior(world, block) {\n  console.log('much instantiate. amaze');\n\n  this.onInteract = function() {\n    alert('such interact. wow.');\n  };\n\n  this.onHover = function() {\n    console.log('very hover');\n  };\n\n  this.onDestroy = function() {\n    console.log(':(');\n  };\n}"; // TODO bring from server or something

  return ide.open({position, code}).then(data => {
    return prototypes.create(position, data.value, data.name).then(codeObj => {
      alert('New code was created correctly with ID: ' + codeObj.id);
    }, err => {
      alert('Error storing code: ' + err);
    });
  });
};

var openExisting = function(position, data) {
  return ide.open({position, blockType: data.blockType, code: data.code}).then(data => {
    if(data.name) {
      return prototypes.fork(position, data.value, data.name).then((codeObj) => {
        alert('Existing code was forked with ID: ' + codeObj.id);
      }, err => {
        alert('Error storing code: ' + err);
      });
    } else {
      return prototypes.modify(position, data.value).then(() => {
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

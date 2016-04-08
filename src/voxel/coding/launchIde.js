import ide from '../../ide';
import controller from './controller';
import auth from '../../auth';

var openNew = function(position) {
  var code = 'this.onInteract = function() {\n  console.log(\'hello w0rld from '+ position + '\');\n};\n'; // TODO bring from server or something

  return ide.open({position, code}).then(data => {
    return controller.createNewPrototype(position, data.value, data.name).then(codeObj => {
      alert('New code was created correctly with ID: ' + codeObj.id);
    }, err => {
      alert('Error storing code: ' + err);
    });
  });
};

var openExisting = function(position, blockType) {
  return ide.open({position, blockType}).then(data => {
    if(data.name) {
      return controller.forkPrototype(position, data.value, data.name, blockType.code.id).then((codeObj) => {
        alert('Existing code was forked with ID: ' + codeObj.id);
      }, err => {
        alert('Error storing code: ' + err);
      });
    }
    return controller.modifyPrototype(position, data.value, blockType.code.id).then(() => {
      alert('Existing code was updated correctly');
    }, err => {
      alert('Error storing code: ' + err);
    });
  });
};

export default function(position) {
  if(!auth.isLogged()) {
    return Promise.reject('Please login to be able to edit code');
  }

  if(controller.hasCode(position)) {
    return openExisting(position, controller.getCode(position));
  } else {
    return openNew(position);
  }
}

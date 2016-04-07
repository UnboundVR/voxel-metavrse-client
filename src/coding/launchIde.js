import ide from '../ide';
import controller from './controller';
import auth from '../auth';

var openNew = function(position) {
  var code = 'console.log(\'hello w0rld from '+ position +'\')\n'; // TODO bring from server or something

  return ide.open({position, code}).then(value => {
    return controller.createNewPrototype(position, value).then(codeObj => {
      alert('New code was created correctly with ID: ' + codeObj.id);
    }, err => {
      alert('Error storing code: ' + err);
    });
  });
};

var openExisting = function(position, blockType) {
  return ide.open({position, blockType}).then((value, isNew) => {
    if(isNew) {
      return controller.forkPrototype(position, value).then((codeObj) => {
        alert('Existing code was forked with ID: ' + codeObj.id);
      }, err => {
        alert('Error storing code: ' + err);
      });
    }
    return controller.modifyPrototype(position, value).then(() => {
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

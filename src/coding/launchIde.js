import ide from '../ide';
import controller from './controller';
import auth from '../auth';
import executor from './scriptExecutor';

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

var openExisting = function(position, codeObj) {
  return ide.open({position, code: codeObj.code, id: codeObj.id}).then((value, isNew) => {
    if(isNew) {
      return alert('Not supported yet');
      // TODO support
    }
    return controller.modifyPrototype(position, value).then(() => {
      alert('Existing code was updated correctly');
      executor.update(position, value);
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

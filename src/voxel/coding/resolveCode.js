import auth from '../../auth';
import github from './github';
import consts from '../../constants';

export default function resolveCode(code) {
  if(auth.isLogged()) {
    return fetch(`${consts.SERVER_ADDRESS()}/coding/${code.id}/${code.revision}`, {
      method: 'GET',
      headers: auth.getAuthHeaders()
    }).then(response => response.json());
  } else {
    return github.getGist(code.id, code.revision);
  }
}

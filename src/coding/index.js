import auth from '../auth';
import consts from '../constants';
import github from './github';

export default {
  get(id, revision) {
    if(auth.isLogged()) {
      return fetch(`${consts.SERVER_ADDRESS()}/coding/${id}/${revision}`, {
        method: 'GET',
        headers: auth.getAuthHeaders()
      }).then(response => response.json());
    } else {
      return github.getGist(id, revision);
    }
  },
  update(id, code) {
    return fetch(`${consts.SERVER_ADDRESS()}/coding/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        code
      }),
      headers: auth.getAuthHeaders()
    }).then(response => response.json());
  },
  fork(id, code) {
    return fetch(`${consts.SERVER_ADDRESS()}/coding/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        code
      }),
      headers: auth.getAuthHeaders()
    }).then(response => response.json());
  },
  create(code) {
    return fetch(`${consts.SERVER_ADDRESS()}/coding`, {
      method: 'POST',
      body: JSON.stringify({
        code
      }),
      headers: auth.getAuthHeaders()
    }).then(response => response.json());
  }
};

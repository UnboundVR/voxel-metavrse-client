import auth from '../auth';
import requests from '../requests';
import github from './github';

export default {
  get(id, revision) {
    if(auth.isLogged()) {
      return requests.requestToServer(`coding/${id}/${revision}`, {
        method: 'GET',
        headers: auth.getAuthHeaders()
      });
    } else {
      return github.getGist(id, revision);
    }
  },
  update(id, code) {
    return requests.requestToServer(`coding/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        code
      }),
      headers: auth.getAuthHeaders()
    });
  },
  fork(id, code) {
    return requests.requestToServer(`coding/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        code
      }),
      headers: auth.getAuthHeaders()
    });
  },
  create(code) {
    return requests.requestToServer('coding', {
      method: 'POST',
      body: JSON.stringify({
        code
      }),
      headers: auth.getAuthHeaders()
    });
  }
};

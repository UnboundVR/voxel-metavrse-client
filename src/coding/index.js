import auth from '../auth';
import consts from '../constants';

export default {
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

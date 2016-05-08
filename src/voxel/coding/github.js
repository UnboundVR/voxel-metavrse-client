import consts from '../../constants';

var SINGLE_FILENAME = 'single_file';

export default {
  getGist(id, revision) {
    return fetch(`${consts.github.API_URL}/gists/${id}/${revision}`, {
      method: 'GET'
    }).then(response => response.json()).then(response => {
      return {
        code: response.files[SINGLE_FILENAME].content
      };
    });
  }
};

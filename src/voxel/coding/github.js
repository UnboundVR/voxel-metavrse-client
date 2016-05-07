import consts from '../../constants';

var SINGLE_FILENAME = 'single_file';

export default {
  getGist(id, revision) {
    return fetch(`${consts.github.API_URL}/gists/${id}/${revision}`, {
      method: 'GET'
    }).then(response => response.json()).then(response => {
      return {
        id: response.id,
        code: response.files[SINGLE_FILENAME].content,
        author: response.owner ? {
          id: response.owner.id,
          avatar: response.owner.avatar_url,
          login: response.owner.login
        } : {
          id: null,
          avatar: 'https://avatars.githubusercontent.com/u/148100?v=3',
          login: 'anonymous'
        },
        url: response.html_url
      };
    });
  }
};

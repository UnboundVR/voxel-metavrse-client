import consts  from '../constants';

export default {
  getLoginUrl() {
    return fetch(consts.SERVER_ADDRESS() + '/auth/github_client_info', {
      method: 'GET'
    }).then(response => response.json()).then(clientInfo =>
      consts.github.OAUTH_URL + '/authorize'
      + '?client_id=' + clientInfo.clientId
      + '&scope=' + consts.github.REQUESTED_SCOPE
      + '&redirect_uri=' + location.origin); // TODO pass state too
  },
  getAccessToken(code) {
    let url = consts.SERVER_ADDRESS() + '/auth/github_access_token/' + code;

    return fetch(url, {
      method: 'GET'
    }).then(response => {
      if(response.ok) {
        return response.json();
      }

      return response.text().then(errorCode => {
        throw new Error('Could not log in to github. ' + errorCode);
      });
    }).then(response => {
      if(response.accessToken) {
        return response.accessToken;
      } else {
        throw new Error('Could not log in to github');
      }
    });
  },
  getLoggedUserInfo(githubAccessToken) {
    return fetch(consts.github.API_URL + '/user', {
      method: 'GET',
      headers: {
        'Authorization': 'token ' + githubAccessToken
      }
    }).then(response => response.json());
  }
};

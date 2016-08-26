import consts from '../constants';
import requests from '../requests';

export default {
  async getLoginUrl() {
    let clientInfo = await requests.requestToServer('auth/github_client_info', {
      method: 'GET'
    });

    // TODO pass state too
    let oauthUrl = consts.github.OAUTH_URL;
    let scope = consts.github.REQUESTED_SCOPE;
    let clientId = clientInfo.clientId;
    let redirectUri = location.origin;
    return `${oauthUrl}/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
  },
  async getAccessToken(code) {
    let url = `auth/github_access_token/${code}`;
    let response = await requests.requestToServer(url, {
      method: 'GET'
    });

    if(response.accessToken) {
      return response.accessToken;
    } else {
      throw new Error('Could not log in to github');
    }
  },
  async getLoggedUserInfo(githubAccessToken) {
    return await requests.request(`${consts.github.API_URL}/user`, {
      method: 'GET',
      headers: {
        'Authorization': 'token ' + githubAccessToken
      }
    });
  }
};

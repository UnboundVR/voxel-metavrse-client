import querystring from 'querystring';
import githubAuth from './githubAuth';
import tokenStore from './tokenStore';
import loading from '../loading';

let accessToken, name, avatarUrl, userId;

export default {
  async init() {
    let loadingResource = loading.log('Initializing auth...');

    if(tokenStore.hasToken()) {
      accessToken = tokenStore.getToken();
      await this.fetchUserData();
      loadingResource.finish(`Logged in as ${name} (${userId})`);
      return;
    }

    let qs = querystring.parse(location.search.substring(1)); // TODO check state too

    if(qs.code) {
      accessToken = await githubAuth.getAccessToken(qs.code);
      loadingResource.update('Got access token from Github...');
      tokenStore.storeToken(accessToken);
      await this.fetchUserData();
      loadingResource.finish(`Logged in as ${name} (${userId})`);
    } else {
      loadingResource.finish('Entering as guest');
    }
  },
  async login() {
    location.href = await githubAuth.getLoginUrl();
  },
  logout() {
    tokenStore.deleteToken();
    location.href = location.origin;
  },
  async fetchUserData() {
    let me = await githubAuth.getLoggedUserInfo(accessToken);

    name = me.name;
    avatarUrl = me.avatar_url;
    userId = me.login;
  },
  getAccessToken() {
    return accessToken;
  },
  getName() {
    return name;
  },
  getAvatarUrl() {
    return avatarUrl;
  },
  getUserId() {
    return userId;
  },
  isLoggedIn() {
    return !!accessToken;
  },
  getAuthHeaders() {
    let headers = {};
    if(accessToken) {
      headers['Authorization'] = accessToken;
    }

    return new Headers(headers);
  }
};

import querystring from 'querystring';
import githubAuth from './githubAuth';
import tokenStore from './tokenStore';

let accessToken, name, avatarUrl, userId;

export default {
  async init() {
    if(tokenStore.hasToken()) {
      accessToken = tokenStore.getToken();
      return await this.fetchUserData();
    }

    let qs = querystring.parse(location.search.substring(1)); // TODO check state too

    if(qs.code) {
      accessToken = await githubAuth.getAccessToken(qs.code);
      tokenStore.storeToken(accessToken);
      return await this.fetchUserData();
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
    userId = me.id;
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

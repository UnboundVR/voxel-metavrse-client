import querystring from 'querystring';
import githubAuth from './githubAuth';
import tokenStore from './tokenStore';

var accessToken;
var name;
var avatarUrl;
var userId;

export default {
  async init() {
    var self = this;
    if(tokenStore.hasToken()) {
      accessToken = tokenStore.getToken();
      return await this.fetchUserData();
    }

    var qs = querystring.parse(location.search.substring(1)); // TODO check state too

    if(qs.code) {
      accessToken = await githubAuth.getAccessToken(qs.code);
      tokenStore.storeToken(accessToken);
      return await self.fetchUserData();
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
    var headers = {};
    if(accessToken) {
      headers['Authorization'] = accessToken;
    }

    return new Headers(headers);
  }
};

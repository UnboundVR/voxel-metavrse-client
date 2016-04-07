import Vue from 'vue';
import AuthComponent from './AuthComponent.vue';
import service from './service';

export default {
  getName: service.getName,
  getUserId: service.getUserId,
  getAccessToken: service.getAccessToken,
  isLogged: service.isLoggedIn,
  init() {
    Vue.component('auth-component', AuthComponent);
    return service.init();
  }
};

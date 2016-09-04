import Vue from 'vue';
import ChatComponent from './ChatComponent.vue';
import service from './service';

export default {
  init() {
    Vue.component('chat-component', ChatComponent);
  },
  debug(message) {
    service.debugMessage(message);
  },
  error(message, error) {
    service.errorMessage(message);
    error && console.log(error);
  },
  verbose(message) {
    service.verboseMessage(message);
  }
};

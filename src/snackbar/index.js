import SnackbarComponent from './SnackbarComponent.vue';
import Vue from 'vue';

export default {
  init() {
    Vue.component('snackbar-component', SnackbarComponent);
  }
};

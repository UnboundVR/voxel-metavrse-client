import Vue from 'vue';
import CodingComponent from './CodingComponent.vue';
import editor from './editor';
import linter from './linter';

export default {
  init() {
    Vue.component('coding-component', CodingComponent);
    linter.register();
  },
  open: editor.open
};

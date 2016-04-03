import service from './service';
import MacroSelectorComponent from './MacroSelectorComponent.vue';
import Vue from 'vue';

export default {
  init() {
    Vue.component('macro-selector-component', MacroSelectorComponent);
  },
  getMain: service.getMain,
  getSecondary: service.getSecondary
};

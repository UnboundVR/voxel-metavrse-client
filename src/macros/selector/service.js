import macros from '../macros.json';
var selectedMain = macros[0];
var selectedSecondary = macros[2];

export default {
  getMacros() {
    return macros;
  },
  selectMain(macro) {
    selectedMain = macro;
  },
  getMain() {
    return selectedMain;
  },
  selectSecondary(macro) {
    selectedSecondary = macro;
  },
  getSecondary() {
    return selectedSecondary;
  }
};

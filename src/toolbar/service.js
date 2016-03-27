import toolbar from 'toolbar';
import blocks from '../blocks';

var toolbarItems;
var currentMaterial;
var selector;

export default {
  init() {
    toolbarItems = blocks.getToolbarItems();
    currentMaterial = toolbarItems[0].number;
  },
  hookSelection() {
    selector = toolbar();
    selector.on('select', function(item) {
      currentMaterial = parseInt(item);
    });
  },
  unhookSelection() {
    selector.removeAllListeners('select');
  },
  getSelected() {
    return currentMaterial;
  },
  getToolbarItems() {
    return toolbarItems;
  }
};

import toolbar from 'toolbar';
import blocks from '../blocks';
import macros from '../macros';

var selector;

export default {
  init() {
    function buildMacro(block) {
      return {
        name: block.name,
        icon: block.icon,
        crosshairIcon: 'crosshair',
        isBlock: true,
        textureId: block.number
      };
    }

    this.items = macros.getMacros().concat(blocks.getToolbarItems().map(buildMacro));
    this.selectedItem = this.items[0];
  },
  hookSelection() {
    selector = toolbar();
    var self = this;
    selector.on('select', function(index) {
      self.selectedItem = self.items[index];
    });
  },
  unhookSelection() {
    selector.removeAllListeners('select');
  }
};

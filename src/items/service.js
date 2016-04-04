import toolbar from 'toolbar';
import voxelEngine from '../voxelEngine';

export default {
  init(itemTypes, blockTypes) {
    var fromBlock = block => ({
      isBlock: true,
      material: block.material,
      name: block.name,
      adjacentActive: true,
      icon: block.icon,
      crosshairIcon: 'crosshair'
    });

    var interact = {
      name: 'Interact',
      icon: 'hand',
      crosshairIcon: 'hand',
      adjacentActive: false
    };

    this.items = [interact].concat(itemTypes).concat(blockTypes.map(fromBlock));
    this.selectedItem = this.items[0];
  },
  hookSelection() {
    this.selector = toolbar();
    var self = this;
    this.selector.on('select', function(index) {
      self.selectedItem = self.items[index];
    });
  },
  unhookSelection() {
    this.selector.removeAllListeners('select');
  },
  isAdjacentActive() {
    return !voxelEngine.engine.controls.state.crouch && this.selectedItem.adjacentActive;
  },
  isDeleteMode() {
    return voxelEngine.engine.controls.state.crouch;
  }
};

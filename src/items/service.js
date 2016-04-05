import toolbar from 'toolbar';
import voxelEngine from '../voxelEngine';
import marketplace from '../marketplace';

export default {
  init() {
    let self = this;

    let fromBlock = block => ({
      isBlock: true,
      material: block.material,
      name: block.name,
      adjacentActive: true,
      icon: block.icon,
      crosshairIcon: 'crosshair'
    });

    let interact = {
      name: 'Interact',
      icon: 'hand',
      crosshairIcon: 'hand',
      adjacentActive: false
    };

    this.items = [interact].concat(marketplace.itemTypes).concat(marketplace.blockTypes.map(fromBlock));
    this.selectedItem = this.items[0];
    this.deleteMode = false;

    voxelEngine.engine.controls.on('data', () => {
      if(voxelEngine.engine.controls.state.crouch != self.deleteMode) {
        self.deleteMode = voxelEngine.engine.controls.state.crouch;
      }
    });
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
  }
};

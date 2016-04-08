import toolbar from 'toolbar';
import voxelEngine from '../voxelEngine';
import marketplace from '../marketplace';
import coding from '../coding';

export default {
  init() {
    let self = this;

    let fromBlock = block => ({
      isBlock: true,
      material: block.material,
      id: block.id,
      name: block.name,
      code: block.code,
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

    let toolbarItems = marketplace.getToolbarItems();
    let itemTypeIds = toolbarItems.filter(item => item.type == 'item').map(item => item.id);
    let blockTypeIds = toolbarItems.filter(item => item.type == 'block').map(item => item.id);

    return Promise.all([marketplace.loadItemTypes(itemTypeIds), marketplace.loadBlockTypes(blockTypeIds).then(newBlocks => {
      return Promise.all(newBlocks.filter(block => block.code).map(block => {
        coding.addBlockTypeCode(block);
      }));
    })]).then(() => {
      var itemTypes = itemTypeIds.map(id => marketplace.getItemTypeById(id));
      var blockTypes = blockTypeIds.map(id => marketplace.getBlockTypeById(id));

      this.items = [interact].concat(itemTypes).concat(blockTypes.map(fromBlock));
      this.selectedItem = this.items[0];

      this.deleteMode = false;

      voxelEngine.engine.controls.on('data', () => {
        if(voxelEngine.engine.controls.state.crouch != self.deleteMode) {
          self.deleteMode = voxelEngine.engine.controls.state.crouch;
        }
      });
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

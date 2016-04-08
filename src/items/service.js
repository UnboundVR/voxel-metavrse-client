import toolbar from 'toolbar';
import voxel from '../voxel';
import auth from '../auth';
import blocks from '../voxel';
import items from './itemTypes';

export default {
  init() {
    let self = this;

    return fetch(process.env.SERVER_ADDRESS + '/marketplace/toolbar', {
      method: 'GET',
      headers: auth.getAuthHeaders()
    }).then(response => response.json()).then(toolbarItems => {

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

      let itemTypeIds = toolbarItems.filter(item => item.type == 'item').map(item => item.id);
      let blockTypeIds = toolbarItems.filter(item => item.type == 'block').map(item => item.id);

      return Promise.all([items.loadMany(itemTypeIds), blocks.loadMany(blockTypeIds)]).then(() => {
        self.items = [interact].concat(toolbarItems.map(item => {
          if(item.type == 'item') {
            return items.getById(item.id);
          } else {
            return fromBlock(blocks.getById(item.id));
          }
        }));
        self.selectedItem = this.items[0];
        self.deleteMode = false;

        voxel.engine.controls.on('data', () => {
          if(voxel.engine.controls.state.crouch != self.deleteMode) {
            self.deleteMode = voxel.engine.controls.state.crouch;
          }
        });
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
    return !voxel.engine.controls.state.crouch && this.selectedItem.adjacentActive;
  }
};

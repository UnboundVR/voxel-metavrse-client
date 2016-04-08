import toolbar from 'toolbar';
import voxel from '../voxel';
import auth from '../auth';
import blocks from '../voxel';
import items from './itemTypes';

export default {
  init() {

    let interact = {
      name: 'Interact',
      icon: 'hand',
      crosshairIcon: 'hand',
      adjacentActive: false
    };

    this.selectedItem = interact;
    this.deleteMode = false;

    if(!this.userLogged) {
      this.items = [];
      return Promise.resolve();
    }

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

        voxel.engine.controls.on('data', () => {
          if(voxel.engine.controls.state.crouch != self.deleteMode) {
            self.deleteMode = voxel.engine.controls.state.crouch;
          }
        });
      });
    });
  },
  hookSelection() {
    if(!this.userLogged) {
      return;
    }

    this.selector = toolbar();
    var self = this;
    this.selector.on('select', function(index) {
      self.selectedItem = self.items[index];
    });
  },
  unhookSelection() {
    if(!this.userLogged) {
      return;
    }

    this.selector.removeAllListeners('select');
  },
  isAdjacentActive() {
    return !voxel.engine.controls.state.crouch && this.selectedItem.adjacentActive;
  },
  userLogged: auth.isLogged()
};

import toolbar from 'toolbar';
import auth from '../../auth';
import voxel from '../../voxel';
import items from '../itemTypes';

const nothing = {
  crosshairIcon: 'hand',
  adjacentActive: false,
  isInteract: true
};

const interact = {
  name: 'Interact',
  icon: 'hand',
  crosshairIcon: 'hand',
  adjacentActive: false,
  isInteract: true
};

function fromBlock(block) {
  return {
    isBlock: true,
    material: block.material,
    id: block.id,
    name: block.name,
    code: block.code,
    adjacentActive: true,
    icon: block.icon,
    crosshairIcon: 'crosshair'
  };
}

export default {
  init() {
    this.userLogged = auth.isLogged();

    this.selectedItem = interact;
    this.deleteMode = false;

    if(!this.userLogged) {
      this.items = [];
      return Promise.resolve();
    }

    let self = this;
    return fetch(process.env.SERVER_ADDRESS + '/inventory/toolbar', {
      method: 'GET',
      headers: auth.getAuthHeaders()
    }).then(response => response.json()).then(toolbarItems => {
      let itemTypeIds = toolbarItems.filter(item => item && item.type == 'item').map(item => item.id);
      let blockTypeIds = toolbarItems.filter(item => item && item.type == 'block').map(item => item.id);

      return Promise.all([items.loadMany(itemTypeIds), voxel.loadMany(blockTypeIds)]).then(() => {
        self.items = [interact].concat(toolbarItems.map(item => {
          if(!item) {
            return nothing;
          }

          if(item.type == 'item') {
            return items.getById(item.id);
          } else {
            return fromBlock(voxel.getById(item.id));
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
  setItem(position, item) {
    var self = this;
    return fetch(process.env.SERVER_ADDRESS + '/inventory/toolbar/' + position, {
      method: 'PUT',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify(item)
    }).then(() => {
      if(item.type == 'block') {
        return voxel.load(item.id).then(() => {
          self.items.$set(position + 1, fromBlock(voxel.getById(item.id)));
        });
      } else {
        return items.load(item.id).then(() => {
          self.items.$set(position + 1, items.getById(item.id));
        });
      }
    });
  },
  removeItem(position) {
    var self = this;
    return fetch(process.env.SERVER_ADDRESS + '/inventory/toolbar/' + position, {
      method: 'DELETE',
      headers: auth.getAuthHeaders()
    }).then(() => {
      self.items.$set(position + 1, nothing);
    });
  }
};

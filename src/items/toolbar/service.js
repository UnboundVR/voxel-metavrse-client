import toolbar from 'toolbar';
import auth from '../../auth';
import voxel from '../../voxel';
import items from '../itemTypes';
import consts from '../../constants';
import requests from '../../requests';
import itemCoding from '../coding';
import extend from 'extend';
import loading from '../../loading';

import events from '../../events';

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
    type: 'block',
    material: block.material,
    id: block.id,
    name: block.name,
    code: block.code,
    adjacentActive: true,
    icon: block.icon,
    crosshairIcon: 'crosshair',
    newerVersion: block.newerVersion
  };
}

function fromItem(item) {
  return extend({}, item, {type: 'item'});
}

export default {
  async init() {
    let loadingResource = loading.log('Initializing toolbar...');

    this.userLogged = auth.isLogged();

    this.selectedItem = interact;
    this.selectedPosition = 0;
    this.deleteMode = false;

    if(!this.userLogged) {
      this.items = [];
      return Promise.resolve();
    }

    let self = this;
    let toolbarItems = await requests.requestToServer('inventory/toolbar', {
      method: 'GET',
      headers: auth.getAuthHeaders()
    });

    let itemTypeIds = toolbarItems.filter(item => item && item.type == 'item').map(item => item.id);
    let blockTypeIds = toolbarItems.filter(item => item && item.type == 'block').map(item => item.id);

    return Promise.all([items.loadMany(itemTypeIds), voxel.loadMany(blockTypeIds)]).then(() => {
      self.items = [interact].concat(toolbarItems.map(item => {
        if(!item) {
          return nothing;
        }

        if(item.type == 'item') {
          return fromItem(items.getById(item.id));
        } else {
          return fromBlock(voxel.getById(item.id));
        }
      }));

      voxel.engine.controls.on('data', () => {
        if(voxel.engine.controls.state.crouch != self.deleteMode) {
          self.deleteMode = voxel.engine.controls.state.crouch;
        }
      });

      events.on(consts.events.CODE_UPDATED, async payload => {
        let newId = payload.newId;
        let oldId = payload.oldId;
        let type = payload.type;
        let position = payload.toolbar;

        if(position === undefined && oldId) {
          for(let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            if(item && item.type == type && item.id == oldId) {
              position = i - 1;
            }
          }
        }

        if(position !== undefined && payload.operation != consts.coding.OPERATIONS.FORK) {
          // if the change originated in toolbar, replace, if not just fetch existing item to grab the "outdated" status
          let idToFetch = payload.toolbar !== undefined ? newId : oldId;

          await this.setItem(position, {id: idToFetch, type, forceReload: idToFetch == oldId});

          alert('Toolbar item modified!');
        }
      });

      loadingResource.finish('Initialized toolbar');
    });
  },
  hookSelection() {
    if(!this.userLogged) {
      return;
    }

    this.selector = toolbar();
    this.selector.on('select', index => {
      this.selectedPosition = index;
      this._refreshSelected();
    });
  },
  unhookSelection() {
    if(!this.userLogged) {
      return;
    }

    this.selector.removeAllListeners('select');
  },
  _refreshSelected() {
    itemCoding.deactivate();
    this.selectedItem = this.items[this.selectedPosition];
    if(this.selectedItem != interact && this.selectedItem != nothing && !this.selectedItem.isBlock) {
      itemCoding.activate(this.selectedItem);
    }
  },
  isAdjacentActive() {
    return !voxel.engine.controls.state.crouch && this.selectedItem.adjacentActive;
  },
  async setItem(position, item) {
    await requests.requestToServer(`inventory/toolbar/${position}`, {
      method: 'PUT',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify(item)
    });

    if(item.type == 'block') {
      await voxel.load(item.id, item.forceReload);
      this.items.$set(position + 1, fromBlock(voxel.getById(item.id)));
    } else {
      await items.load(item.id, item.forceReload);
      this.items.$set(position + 1, fromItem(items.getById(item.id)));
    }

    if(this.selectedPosition == position + 1) {
      this._refreshSelected();
    }
  },
  async removeItem(position) {
    var self = this;
    await requests.requestToServer(`inventory/toolbar/${position}`, {
      method: 'DELETE',
      headers: auth.getAuthHeaders()
    });

    self.items.$set(position + 1, nothing);
  },
  async editCode(item, position) {
    if(item == interact) {
      alert('Interact cannot be edited');
    } else {
      if(item == nothing) {
        item = undefined;
      }
      events.emit(consts.events.EDIT_CODE, {
        type: (item && item.type) || (confirm('Want to create a new item or block? Yes = item, no = block') ? 'item' : 'block'),
        toolbar: position,
        id: item && item.id
      });
    }
  }
};

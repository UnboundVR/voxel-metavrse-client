import toolbar from 'toolbar';
import auth from '../../auth';
import voxel from '../../voxel';
import items from '../itemTypes';
import consts from '../../constants';
import itemCoding from '../coding';
import coding from '../../coding';
import inventory from '../../inventory';
import ide from '../../ide';

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
    return fetch(consts.SERVER_ADDRESS() + '/inventory/toolbar', {
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
  async setItem(position, item) {
    await fetch(`${consts.SERVER_ADDRESS()}/inventory/toolbar/${position}`, {
      method: 'PUT',
      headers: auth.getAuthHeaders(),
      body: JSON.stringify(item)
    });

    if(item.type == 'block') {
      await voxel.load(item.id);
      this.items.$set(position + 1, fromBlock(voxel.getById(item.id)));
    } else {
      await items.load(item.id);
      this.items.$set(position + 1, items.getById(item.id));
    }
  },
  async removeItem(position) {
    var self = this;
    await fetch(`${consts.SERVER_ADDRESS()}/inventory/toolbar/${position}`, {
      method: 'DELETE',
      headers: auth.getAuthHeaders()
    });

    self.items.$set(position + 1, nothing);
  },
  async editCode(item, position) {
    if(item.isBlock) {
      alert('Block edition from toolbar not yet supported');
      return;
    }

    let code = itemCoding.get(item.id);
    let data = await ide.open({item, code});

    let name = data.name || `${item.name} bis`;
    let codingOperation = data.name ? coding.fork : coding.update;
    let newCode = data.value;

    let props = {
      name,
      adjacentActive: item.adjacentActive,
      crosshairIcon: item.crosshairIcon
    };

    let codeObj = await codingOperation(code.id, newCode);
    let updatedItemType = await inventory.addItemType(props, codeObj);

    await this.setItem(position, updatedItemType);
  }
};

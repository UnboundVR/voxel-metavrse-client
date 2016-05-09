const MARKETPLACE = 'inventory';
import events from '../events';
import consts from '../constants';
import auth from '../auth';
import items from '../items';

export default {
  allBlockTypes: [],
  allItemTypes: [],
  toolbarItems: [],
  isOpen: false,
  open() {
    this.isOpen = true;
    events.emit(consts.events.FULLSCREEN_WINDOW_OPEN, {name: MARKETPLACE});
  },
  close() {
    this.isOpen = false;
    events.emit(consts.events.FULLSCREEN_WINDOW_CLOSE, {name: MARKETPLACE});
  },
  bringAllItems() {
    var self = this;

    this.toolbarItems.splice(0, this.toolbarItems.length);
    items.getToolbarItems().forEach(item => {
      self.toolbarItems.push(item);
    });

    return fetch(consts.SERVER_ADDRESS() + '/inventory/all', {
      method: 'GET',
      headers: auth.getAuthHeaders()
    }).then(response => response.json()).then(res => {
      self.allBlockTypes.splice(0, self.allBlockTypes.length);
      res.blockTypes.forEach(type => {
        self.allBlockTypes.push(type);
      });

      self.allItemTypes.splice(0, self.allItemTypes.length);
      res.itemTypes.forEach(type => {
        self.allItemTypes.push(type);
      });
    });
  },
  addToToolbar(type, id) {
    var position = parseInt(prompt('Enter position (2-9)'));
    if(Number.isNaN(position) || position > 9 || position < 2) {
      return alert('Invalid position');
    }
    position--;

    items.setToolbarItem(position - 1, {type, id}).then(() => {
      this.toolbarItems.$set(position, items.getToolbarItems()[position]);
    });
  },
  removeFromToolbar(position) {
    if(position == 0) {
      return alert('Cannot remove interact from first position');
    }

    items.removeToolbarItem(position - 1).then(() => {
      this.toolbarItems.$set(position, items.getToolbarItems()[position]);
    });
  },
  addBlockType(name, material, code) {
    return fetch(`${consts.SERVER_ADDRESS()}/inventory/blockType`, {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        material
      }),
      headers: auth.getAuthHeaders()
    }).then(response => response.json());
  },
  addItemType(props, code) {
    return fetch(`${consts.SERVER_ADDRESS()}/inventory/itemType`, {
      method: 'POST',
      body: JSON.stringify({
        code,
        name: props.name,
        adjacentActive: props.adjacentActive,
        crosshairIcon: props.crosshairIcon
      }),
      headers: auth.getAuthHeaders()
    }).then(response => response.json());
  }
};

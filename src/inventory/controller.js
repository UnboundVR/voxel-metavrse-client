const INVENTORY = 'inventory';
import events from '../events';
import consts from '../constants';
import requests from '../requests';
import auth from '../auth';
import items from '../items';
import voxel from '../voxel';

export default {
  allBlockTypes: [],
  allItemTypes: [],
  toolbarItems: [],
  isOpen: false,
  async editCode(item, type, toolbar) {
    type = type || (confirm('Want to create a new item or block? Yes = item, no = block') ? 'item' : 'block');

    // Technically this is not necessary, but it speeds up the loading :)
    if(item.id) {
      let loadOperation = type == 'block' ? voxel.load : items.load;
      await loadOperation(item.id);
    }

    this.isOpen = false;
    events.emit(consts.events.EDIT_CODE, {
      type,
      id: item && item.id,
      toolbar
    });
  },
  open() {
    this.isOpen = true;
    events.emit(consts.events.FULLSCREEN_WINDOW_OPEN, {name: INVENTORY});
  },
  close() {
    this.isOpen = false;
    events.emit(consts.events.FULLSCREEN_WINDOW_CLOSE, {name: INVENTORY});
  },
  async bringAllItems() {
    var self = this;

    this.toolbarItems.splice(0, this.toolbarItems.length);
    items.getToolbarItems().forEach(item => {
      self.toolbarItems.push(item);
    });

    let res = await requests.requestToServer('inventory/all', {
      method: 'GET',
      headers: auth.getAuthHeaders()
    });

    self.allBlockTypes.splice(0, self.allBlockTypes.length);
    res.blockTypes.forEach(type => {
      self.allBlockTypes.push(type);
    });

    self.allItemTypes.splice(0, self.allItemTypes.length);
    res.itemTypes.forEach(type => {
      self.allItemTypes.push(type);
    });
  },
  addToToolbar(type, id) {
    var position = parseInt(prompt('Enter position (2-9)'));
    if(Number.isNaN(position) || position > 9 || position < 2) {
      console.log('Invalid position');
      return;
    }
    position--;

    if(items.hasTestingCode(position - 1)) {
      console.log(`Item at #${position + 1} has testing code - it cannot be moved from the toolbar`);
      return;
    }

    items.setToolbarItem(position - 1, {type, id}).then(() => {
      this.toolbarItems.$set(position, items.getToolbarItems()[position]);
    });
  },
  removeFromToolbar(position) {
    if(position == 0) {
      console.log('Cannot remove interact from first position');
      return;
    }

    if(items.hasTestingCode(position - 1)) {
      console.log(`Item at #${position + 1} has testing code - it cannot be moved from the toolbar`);
      return;
    }

    items.removeToolbarItem(position - 1).then(() => {
      this.toolbarItems.$set(position, items.getToolbarItems()[position]);
    });
  },
  async addBlockType(name, material, code) {
    return await requests.requestToServer('inventory/blockType', {
      method: 'POST',
      body: JSON.stringify({
        code,
        name,
        material
      }),
      headers: auth.getAuthHeaders()
    });
  },
  async updateBlockCode(blockTypeId, code) {
    return await requests.requestToServer(`inventory/blockType/${blockTypeId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        code
      }),
      headers: auth.getAuthHeaders()
    });
  },
  async updateItemCode(itemTypeId, code) {
    return await requests.requestToServer(`inventory/itemType/${itemTypeId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        code
      }),
      headers: auth.getAuthHeaders()
    });
  },
  async addItemType(props, code) {
    return await requests.requestToServer('inventory/itemType', {
      method: 'POST',
      body: JSON.stringify({
        code,
        name: props.name,
        adjacentActive: props.adjacentActive,
        crosshairIcon: props.crosshairIcon
      }),
      headers: auth.getAuthHeaders()
    });
  }
};

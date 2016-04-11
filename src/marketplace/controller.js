const MARKETPLACE = 'marketplace';
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

    return fetch(process.env.SERVER_ADDRESS + '/marketplace/all', {
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
  addToToolbar(item) {
    this.toolbarItems.push(item);
  },
  removeFromToolbar(item) {
    var toolbarItem = this.toolbarItems.filter(i => i.id == item.id)[0];
    var index = this.toolbarItems.indexOf(toolbarItem);
    this.toolbarItems.splice(index, 1);
  }
};

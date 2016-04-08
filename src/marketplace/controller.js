const MARKETPLACE = 'marketplace';
import events from '../events';
import consts from '../constants';
import auth from '../auth/service'; // FIXME this is here to avoid a circular dependency. Things are coupled due to the dropdown in auth component.

function loadTypes(loadedTypes, type, ids, force) {
  var loadedIds = loadedTypes.map(type => type.id);
  var pendingIds = force ? ids : ids.filter(id => !loadedIds.includes(id));

  if(!pendingIds.length) {
    return Promise.resolve([]);
  }

  return fetch(process.env.SERVER_ADDRESS + '/marketplace/'+ type + '?ids=' + pendingIds, {
    method: 'GET',
    headers: auth.getAuthHeaders()
  }).then(response => response.json()).then(response => {
    response.forEach(item => {
      loadedTypes.push(item);
    });
    return response;
  });
}

export default {
  isOpen: false,
  open() {
    this.isOpen = true;
    events.emit(consts.events.FULLSCREEN_WINDOW_OPEN, {name: MARKETPLACE});
  },
  close() {
    this.isOpen = false;
    events.emit(consts.events.FULLSCREEN_WINDOW_CLOSE, {name: MARKETPLACE});
  },
  init() {
    let self = this;

    self.loadedItemTypes = [];
    self.loadedBlockTypes = [];
    self.allItemTypes = [];
    self.allBlockTypes = [];

    return fetch(process.env.SERVER_ADDRESS + '/marketplace/init', {
      method: 'GET',
      headers: auth.getAuthHeaders()
    }).then(response => response.json()).then(response => {
      self.allMaterials = response.materials;
      self.toolbarItems = response.toolbar;
    });
  },
  bringAllItems() {
    var self = this;
    return fetch(process.env.SERVER_ADDRESS + '/marketplace/all', {
      method: 'GET',
      headers: auth.getAuthHeaders()
    }).then(response => response.json()).then(res => {
      self.allBlockTypes.splice(0, self.allBlockTypes.length);
      self.allItemTypes.splice(0, self.allItemTypes.length);
      res.blockTypes.forEach(type => {
        self.allBlockTypes.push(type);
      });
      res.itemTypes.forEach(type => {
        self.allItemTypes.push(type);
      });
    });
  },
  loadItemTypes(ids, force) {
    return loadTypes(this.loadedItemTypes, 'itemTypes', ids, force);
  },
  loadBlockTypes(ids, force) {
    return loadTypes(this.loadedBlockTypes, 'blockTypes', ids, force);
  },
  addBlockType(blockType) {
    this.loadedBlockTypes.push(blockType);
  }
};

const MARKETPLACE = 'marketplace';
import events from '../events';
import consts from '../constants';
import auth from '../auth';

export default {
  allBlockTypes: [],
  allItemTypes: [],
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
  }
};

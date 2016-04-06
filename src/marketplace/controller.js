const MARKETPLACE = 'marketplace';
import events from '../events';
import consts from '../constants';
import auth from '../auth/service'; // FIXME this is here to avoid a circular dependency. Things are coupled because the dropdown in auth component.

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
    let request = new Request(process.env.SERVER_ADDRESS + '/marketplace/init?token=' + auth.getAccessToken(), {
      method: 'GET'
    });

    let self = this;
    return fetch(request).then(response => response.json()).then(response => {
      self.materials = response.materials;
      self.itemTypes = response.itemTypes;
      self.blockTypes = response.blockTypes;
    });
  }
};

import voxel from './voxel';
import auth from './auth';
import playerSync from './playerSync';
import chat from './chat';
import items from './items';
import ide from './ide';
import inventory from './inventory';
import rootVue from './rootVue';
import querystring from 'querystring';

/* global Pace */

var qs = querystring.parse(location.search.substring(1));
if(qs.server) {
  window.SERVER_ADDRESS = qs.server;
  console.log('Using server', window.SERVER_ADDRESS);
}

function appendToContainer(engine) {
  if (engine.notCapable()) {
    throw new Error('Browser not capable');
  }

  var logo = document.getElementById('logo');
  logo.style.display = 'none';

  var container = document.getElementById('container');
  engine.appendTo(container);

  Pace.stop();
}

// TODO handle errors gracefully
auth.init().then(() => {
  return voxel.init();
}).then(() => {
  return Promise.all([
    playerSync.init(),
    chat.init(),
    items.init(),
    ide.init(),
    inventory.init()
  ]);
}).then(() => {
  appendToContainer(voxel.engine);

  rootVue.init();
});

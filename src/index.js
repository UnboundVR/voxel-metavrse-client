import voxel from './voxel';
import auth from './auth';
import playerSync from './playerSync';
import chat from './chat';
import items from './items';
import ide from './ide';
import inventory from './inventory';
import rootVue from './rootVue';

function appendToContainer(engine) {
  if (engine.notCapable()) {
    throw new Error('Browser not capable');
  }

  var container = document.getElementById('container');
  engine.appendTo(container);
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

import voxel from './voxel';
import auth from './auth';
import playerSync from './playerSync';
import chat from './chat';
import items from './items';
import ide from './ide';
import inventory from './inventory';
import rootVue from './rootVue';
import querystring from 'querystring';
import loading from './loading';
import map from './map';

let qs = querystring.parse(location.search.substring(1));
if(qs.server) {
  window.SERVER_ADDRESS = qs.server;
  console.log('Using server', window.SERVER_ADDRESS);
}

function appendToContainer(engine) {
  if (engine.notCapable()) {
    throw new Error('Browser not capable');
  }

  loading.finish(true);

  let container = document.getElementById('container');
  engine.appendTo(container);
}

async function init() {
  try {
    await auth.init();

    await Promise.all([
      voxel.init().then(() => Promise.all([playerSync.init(), items.init()])),
      chat.init(),
      ide.init(),
      inventory.init(),
      map.init()
    ]);

    appendToContainer(voxel.engine);
    rootVue.init();

    console.log('Finished initializing!');
  } catch(err) {
    console.log('Error initializing', err);
    loading.finish(false);
  }
}

init();

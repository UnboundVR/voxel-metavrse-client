import client from './voxelClient';
import auth from './auth';
import coding from './coding';
import playerSync from './playerSync';
import voxelEngine from './voxelEngine';
import chat from './chat';
import items from './items';
import ide from './ide';
import marketplace from './marketplace';
import rootVue from './rootVue';

// TODO handle errors gracefully
auth.init().then(() => {
  return marketplace.init();
}).then(() => {
  return client.init();
}).then(() => {
  voxelEngine.init(client.engine);

  return Promise.all([
    playerSync.init(),
    chat.init(),
    coding.init(),
    items.init(),
    ide.init()
  ]);
}).then(() => {
  try {
    voxelEngine.appendToContainer();
  } catch(err) {
    console.log('Browser not capable');
  }

  rootVue.init();
});

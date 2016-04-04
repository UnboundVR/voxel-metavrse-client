import client from './voxelClient';
import auth from './auth';
import coding from './coding';
import playerSync from './playerSync';
import voxelEngine from './voxelEngine';
import chat from './chat';
import items from './items';
import ide from './ide';
import rootVue from './rootVue';

auth.init().then(() => {
  client.init().then(() => {
    voxelEngine.init(client.engine);

    Promise.all([
      playerSync.init(),
      chat.init(),
      coding.init(),
      items.init(),
      ide.init()
    ]).then(() => {
      try {
        voxelEngine.appendToContainer();
      } catch(err) {
        console.log('Browser not capable');
      }

      rootVue.init();
    }).catch((err) => {
      console.log('Error initializing some modules', err);
      throw err;
    });
  });
});

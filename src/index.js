import client from './voxelClient';
import auth from './auth';
import coding from './coding';
import macros from './macros';
import playerSync from './playerSync';
import voxelEngine from './voxelEngine';
import chat from './chat';
import toolbar from './toolbar';
import ide from './ide';
import rootVue from './rootVue';

auth.init().then(() => {
  client.init().then(() => {
    voxelEngine.init(client.engine);

    Promise.all([
      macros.init(),
      playerSync.init(),
      chat.init(),
      coding.init(),
      toolbar.init(),
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

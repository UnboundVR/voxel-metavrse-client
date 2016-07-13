import classes from './classes';
import instances from './instances';
import launchIde from './launchIde';
import scripts from './scripts';
import events from '../../events';
import consts from '../../constants';
import types from '../blockTypes';
import extend from 'extend';

export default {
  removeCode: instances.removeCode.bind(instances),
  storeCode: instances.storeCode.bind(instances),
  registerBlockType: scripts.loadClass.bind(scripts),
  setVoxelEngine(engine) {
    classes.voxelEngine = engine;
  },
  init() {
    events.on(consts.events.EDIT_CODE, async payload => {
      if(payload.type == 'block') {
        let data = {
          position: payload.map,
          toolbar: payload.toolbar
        };
        if(payload.map) {
          if(instances.hasCode(payload.map)) {
            extend(data, instances.getCode(payload.map));
            launchIde.openExisting(data);
          } else {
            launchIde.openNew(data);
          }
        } else if(payload.id) {
          data.blockType = await types.load(payload.id);
          data.code = scripts.getCode(data.blockType.id);
          launchIde.openExisting(data);
        }
      }
    });
  }
};

import classes from './classes';
import instances from './instances';
import launchIde from './launchIde';
import scripts from './scripts';
import events from '../../events';
import consts from '../../constants';
import types from '../blockTypes';
import extend from 'extend';

let voxelEngine;

export default {
  removeCode: instances.removeCode.bind(instances),
  storeCode: instances.storeCode.bind(instances),
  registerBlockType: scripts.loadClass.bind(scripts),
  setVoxelEngine(engine) {
    voxelEngine = engine;
  },
  init() {
    events.on(consts.events.EDIT_CODE, async payload => {
      if(payload.type == 'block') {
        let data = {
          position: payload.map,
          toolbar: payload.toolbar
        };
        if(payload.map) {
          let position = payload.map;
          if(instances.hasCode(position)) {
            extend(data, instances.getCode(position)); // gets code and blockType properties
            launchIde.openExisting(data);
          } else {
            data.material = voxelEngine.getBlock(position);
            launchIde.openNew(data);
          }
        } else if(payload.id) {
          await types.load(payload.id);
          let blockType = types.getById(payload.id);
          if(blockType.code) {
            data.blockType = blockType;
            data.code = scripts.getCode(blockType.id);
            launchIde.openExisting(data);
          } else {
            data.material = blockType.material;
            launchIde.openNew(data);
          }
        }
      }
    });
  }
};

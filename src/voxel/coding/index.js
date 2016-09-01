import instances from './instances';
import launchIde from './launchIde';
import scripts from './scripts';
import events from '../../events';
import consts from '../../constants';
import types from '../blockTypes';
import extend from 'extend';
import testing from './testing';
import simpleBlockTypes from '../simpleBlockTypes';

let voxelEngine;

export default {
  removeCode: instances.removeCode.bind(instances),
  storeCode: instances.storeCode.bind(instances),
  registerBlockType: scripts.loadClass.bind(scripts),
  setVoxelEngine(engine) {
    voxelEngine = engine;
  },
  hasTestingCode: testing.hasTestingCode.bind(testing),
  clearTestingCode: testing.clearTestingCode.bind(testing),
  getTestingCode: testing.getTestingCode.bind(testing),
  init() {
    testing.init();
    instances.init();

    events.on(consts.events.EDIT_CODE, async payload => {
      if(payload.type == 'block') {
        let data = {
          position: payload.map,
          toolbar: payload.toolbar
        };
        if(payload.map) {
          let position = payload.map;
          let testingCode = testing.getTestingCode(position);

          if(instances.hasCode(position)) {
            extend(data, instances.getCode(position)); // gets code and blockType properties

            if(testingCode) {
              data.code.code = testingCode;
              data.code.testingLocally = true;
            }

            launchIde.openExisting(data);
          } else {
            let material = voxelEngine.getBlock(position);
            let blockType = types.getById(simpleBlockTypes.get(material));

            if(blockType) {
              data.material = material;
              data.blockType = blockType;

              if(testingCode) {
                data.code = {
                  code: testingCode,
                  testingLocally: true
                };
              }

              launchIde.openNew(data);
            } else {
              console.log(`Block at ${position} with material ${material} does not have a blockType associated, so we cannot edit its code`);
            }
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
            data.blockType = blockType;
            launchIde.openNew(data);
          }
        } else {
          launchIde.openNew(data);
        }
      }
    });
  }
};

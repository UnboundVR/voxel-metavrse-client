import types from './blockTypes';
import client from './voxelClient';
import coding from './coding';
import consts from '../constants';
import events from '../events';
import playerSync from '../playerSync';
import permissions from './permissions';
import simpleBlockTypes from './simpleBlockTypes';

export default {
  async init() {
    coding.init();

    let engine = await client.init();
    this.engine = engine;
    coding.setVoxelEngine(engine);

    events.on(consts.events.OPEN_CHUNK_PERMISSIONS, () => {
      let pos = playerSync.getUserPosition();
      let voxelPosition = [Math.round(pos.x), Math.round(pos.y), Math.round(pos.z)];

      permissions.editChunkPermissions(voxelPosition);
    });
  },
  registerSimpleType(blockType) {
    simpleBlockTypes.store(blockType.material, blockType.id);
  },
  loadMany: types.loadMany.bind(types),
  load: types.load.bind(types),
  getById: types.getById.bind(types),
  removeCode: coding.removeCode.bind(coding),
  storeCode: coding.storeCode.bind(coding),
  broadcastSetBlock: client.setBlock.bind(client),
  broadcastRemoveBlock: client.clearBlock.bind(client),
  hasPermission: permissions.hasPermission.bind(permissions),
  hasTestingCode: coding.hasTestingCode.bind(coding),
  clearTestingCode: coding.clearTestingCode.bind(coding)
};

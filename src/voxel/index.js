import types from './blockTypes';
import client from './voxelClient';
import coding from './coding';
import consts from '../constants';
import events from '../events';
import playerSync from '../playerSync';
import permissions from './permissions';

export default {
  async init() {
    let engine = await client.init();
    this.engine = engine;
    coding.setVoxelEngine(engine);
    coding.init();

    events.on(consts.events.OPEN_CHUNK_PERMISSIONS, () => {
      let pos = playerSync.getUserPosition();
      let voxelPosition = [Math.round(pos.x), Math.round(pos.y), Math.round(pos.z)];

      permissions.editChunkPermissions(voxelPosition);
    });
  },
  loadMany: types.loadMany.bind(types),
  load: types.load.bind(types),
  getById: types.getById.bind(types),
  removeCode: coding.removeCode.bind(coding),
  storeCode: coding.storeCode.bind(coding),
  broadcastSetBlock: client.setBlock.bind(client),
  broadcastRemoveBlock: client.clearBlock.bind(client),
  hasPermission: permissions.hasPermission.bind(permissions)
};

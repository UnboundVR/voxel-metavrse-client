import types from './blockTypes';
import client from './voxelClient';
import coding from './coding';

export default {
  async init() {
    let engine = await client.init();
    this.engine = engine;
    coding.setVoxelEngine(engine);
    coding.init();
  },
  loadMany: types.loadMany.bind(types),
  load: types.load.bind(types),
  getById: types.getById.bind(types),
  removeCode: coding.removeCode.bind(coding),
  storeCode: coding.storeCode.bind(coding),
  broadcastSetBlock: client.setBlock.bind(client),
  broadcastRemoveBlock: client.clearBlock.bind(client)
};

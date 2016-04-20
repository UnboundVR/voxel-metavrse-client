import types from './blockTypes';
import client from './voxelClient';
import coding from './coding';

export default {
  init() {
    let self = this;
    return client.init().then(engine => {
      self.engine = engine;
      coding.setVoxelEngine(engine);
    });
  },
  loadMany: types.loadMany.bind(types),
  load: types.load.bind(types),
  getById: types.getById.bind(types),
  removeCode: coding.removeCode.bind(coding),
  editCode: coding.editCode.bind(coding),
  storeCode: coding.storeCode.bind(coding),
  broadcastSetBlock: client.setBlock.bind(client),
  broadcastRemoveBlock: client.clearBlock.bind(client)
};

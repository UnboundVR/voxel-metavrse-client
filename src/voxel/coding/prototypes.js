import executor from './scriptExecutor';
import types from '../blockTypes';
import voxelClient from '../voxelClient';
import instances from './instances';
import coding from '../../coding';
import inventory from '../../inventory';

async function processNew(position, blockType) {
  types.add(blockType);

  await executor.loadPrototype(blockType);

  instances.storeCode(position, blockType.id);
  voxelClient.setBlock(position, blockType.id);

  return blockType.code;
}

async function forkOrUpdate(codingOperation, position, material, code, name) {
  let blockTypeId = instances.getBlockTypeId(position);
  let blockType = types.getById(blockTypeId);
  let codeId = blockType.code.id;

  name = name || `${blockType.name} bis`;

  let codeObj = await codingOperation(codeId, code);
  let updatedBlockType = await inventory.addBlockType(name, material, codeObj);

  return processNew(position, updatedBlockType);
}

export default {
  async modify(position, code) {
    let material = this.voxelEngine.getBlock(position);
    return forkOrUpdate(coding.update, position, material, code, null);
  },
  async fork(position, code, name) {
    let material = this.voxelEngine.getBlock(position);
    return forkOrUpdate(coding.fork, position, material, code, name);
  },
  async create(position, code, name) {
    let material = this.voxelEngine.getBlock(position);

    let codeObj = await coding.create(code);
    let blockType = await inventory.addBlockType(name, material, codeObj);

    return processNew(position, blockType);
  }
};

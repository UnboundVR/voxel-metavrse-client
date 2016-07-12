import scripts from './scripts';
import types from '../blockTypes';
import voxelClient from '../voxelClient';
import instances from './instances';
import coding from '../../coding';
import inventory from '../../inventory';

async function processNew(position, blockType) {
  types.add(blockType);

  await scripts.loadClass(blockType);

  instances.storeCode(position, blockType.id);
  voxelClient.setBlock(position, blockType.id);

  return blockType.code;
}

export default {
  async modify(position, code) {
    let blockTypeId = instances.getBlockTypeId(position);
    let blockType = types.getById(blockTypeId);
    let codeId = blockType.code.id;

    let codeObj = await coding.update(codeId, code);
    let updatedBlockType = await inventory.updateBlockCode(blockTypeId, codeObj);

    return processNew(position, updatedBlockType);
  },
  async fork(position, code, name) {
    let material = this.voxelEngine.getBlock(position);
    let blockTypeId = instances.getBlockTypeId(position);
    let blockType = types.getById(blockTypeId);
    let codeId = blockType.code.id;

    let codeObj = await coding.fork(codeId, code);
    let updatedBlockType = await inventory.addBlockType(name, material, codeObj);

    return processNew(position, updatedBlockType);
  },
  async create(position, code, name) {
    let material = this.voxelEngine.getBlock(position);

    let codeObj = await coding.create(code);
    let blockType = await inventory.addBlockType(name, material, codeObj);

    return processNew(position, blockType);
  }
};

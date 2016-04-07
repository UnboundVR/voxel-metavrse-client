import EventEmitter2 from 'eventemitter2';
import util from 'util';

var prototypes = {};

function buildPrototype(blockType) {
  var BlockPrototype = function(type) {
    this.blockType = type;
  };
  util.inherits(BlockPrototype, EventEmitter2.EventEmitter2);

  var proto = new BlockPrototype(blockType);
  (new Function(blockType.code.code).bind(proto))();

  return proto;
}

function registerBlockType(blockType) {
  prototypes[blockType.id] = buildPrototype(blockType);
}

function getPrototype(id) {
  return prototypes[id];
}

export default {
  registerBlockType,
  getPrototype
};

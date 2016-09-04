let mapping = {};

export default {
  store(material, blockTypeId) {
    mapping[material] = blockTypeId;
  },
  get(material) {
    return mapping[material];
  }
};

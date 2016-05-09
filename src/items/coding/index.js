export default {
  registerItemType(type) {
    console.log('should load code of', type.name);
  },
  edit(item) {
    alert(`Editing code of item ${item.name}`);
  }
};

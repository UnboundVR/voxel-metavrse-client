import toolbar from 'toolbar';

export default {
  init(itemTypes, blockTypes) {
    var fromBlock = block => ({
      isBlock: true,
      material: block.material,
      name: block.name,
      adjacentActive: true,
      icon: block.icon,
      crosshairIcon: 'crosshair'
    });

    this.items = itemTypes.concat(blockTypes.map(fromBlock));
    this.selectedItem = this.items[0];
  },
  hookSelection() {
    this.selector = toolbar();
    var self = this;
    this.selector.on('select', function(index) {
      self.selectedItem = self.items[index];
    });
  },
  unhookSelection() {
    this.selector.removeAllListeners('select');
  }
};

export default {
  init() {
    let request = new Request(process.env.SERVER_ADDRESS + '/marketplace/init', {
      method: 'GET'
    });

    let self = this;
    return fetch(request).then(response => response.json()).then(response => {
      self.materials = response.materials;
      self.itemTypes = response.itemTypes;
      self.blockTypes = response.blockTypes;
    });
  }
};

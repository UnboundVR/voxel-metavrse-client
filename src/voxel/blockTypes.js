import auth from '../auth';
import coding from './coding';

var types = {};

export default {
  loadMany(ids, force) {
    var loadedIds = Object.keys(types);
    var pendingIds = force ? ids : ids.filter(id => !loadedIds.includes(id));

    if(!pendingIds.length) {
      return Promise.resolve([]);
    }

    return fetch(process.env.SERVER_ADDRESS + '/marketplace/blockTypes?ids=' + pendingIds, {
      method: 'GET',
      headers: auth.getAuthHeaders()
    }).then(response => response.json()).then(response => {

      response.forEach(type => {
        types[type.id] = type;
      });

      var newItems = response.filter(type => type.code && pendingIds.includes(type.id));
      var registerPromises = newItems.map(coding.registerBlockType);
      return Promise.all(registerPromises);
    });
  },
  load(id, force) {
    return this.loadMany([id], force);
  },
  getById(id) {
    return types[id];
  },
  add(type) {
    types[type.id] = type;
  }
};

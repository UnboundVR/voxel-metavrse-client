// FIXME this is almost the same as blockTypes.js, should reuse code

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

    return fetch(process.env.SERVER_ADDRESS + '/inventory/itemTypes?ids=' + pendingIds, {
      method: 'GET',
      headers: auth.getAuthHeaders()
    }).then(response => response.json()).then(response => {
      return Promise.all(response.map(item => {
        types[item.id] = item;
        if(item.code && pendingIds.includes(item.id)) {
          return coding.registerItemType(item);
        }
      }));
    });
  },
  load(id, force) {
    return this.loadMany([id], force);
  },
  getById(id) {
    return types[id];
  }
};

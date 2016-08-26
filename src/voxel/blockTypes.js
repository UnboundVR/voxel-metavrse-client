import auth from '../auth';
import coding from './coding';
import requests from '../requests';

var types = {};

export default {
  async loadMany(ids, force) {
    var pendingIds = force ? ids : ids.filter(id => !types[id]);

    if(!pendingIds.length) {
      return Promise.resolve([]);
    }

    let response = await requests.requestToServer(`inventory/blockTypes?ids=${pendingIds}`, {
      method: 'GET',
      headers: auth.getAuthHeaders()
    });

    for(let type of response) {
      types[type.id] = type;
    }

    let newItems = response.filter(type => type.code && pendingIds.includes(type.id));
    let registerPromises = newItems.map(coding.registerBlockType);
    return await Promise.all(registerPromises);
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

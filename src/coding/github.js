import consts from '../constants';
import requests from '../requests';

var SINGLE_FILENAME = 'single_file';

export default {
  async getGist(id, revision) {
    let response = await requests.request(`${consts.github.API_URL}/gists/${id}/${revision}`, {
      method: 'GET'
    });

    return {
      code: response.files[SINGLE_FILENAME].content,
      revision: {
        id: response.history[0].version,
        date: response.history[0].committed_at
      }
    };
  }
};

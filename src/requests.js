import consts from './constants';

export default {
  async request(url, options) {
    let response = await fetch(url, options);

    if (!response.ok) {
      let text = response.statusText;
      let responseText = response.text();
      if(responseText) {
        text += ' - ' + responseText;
      }

      throw Error(text);
    }

    return await response.json();
  },
  async requestToServer(url, options) {
    return this.request(`${consts.SERVER_ADDRESS()}/${url}`, options);
  }
};

import querystring from 'querystring';

export default {
  init() {
    let qs = querystring.parse(location.search.substring(1));

    if(qs.position) {
      let position = qs.position.split(',').map(coord => parseInt(coord));

      console.log(`Setting teleport position to ${position.join('|')}`);
      this.teleportPosition = position;
    }
  }
};

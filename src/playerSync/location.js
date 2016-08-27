import querystring from 'querystring';
import avatar from './avatar';
import requests from '../requests';

export default {
  init() {
    let qs = querystring.parse(location.search.substring(1));

    if(qs.position) {
      let position = qs.position.split(',').map(coord => parseInt(coord));

      console.log(`Teleporting user to ${position.join('|')}`);
      avatar.move(position);
    }
  },
  async shareLocation() {
    let pos = avatar.getPosition();
    let link = `${location.origin}?position=${Math.round(pos.x)},${Math.round(pos.y)},${Math.round(pos.z)}`;

    if(process.env.BITLY_ACCESS_TOKEN) {
      try {
        let token = process.env.BITLY_ACCESS_TOKEN;
        let longUrl = encodeURIComponent(link);
        let bitlyResponse = await requests.request(`https://api-ssl.bitly.com/v3/shorten?access_token=${token}&longUrl=${longUrl}`);

        if(bitlyResponse.status_code == 200) {
          link = bitlyResponse.data.url;
        } else {
          throw new Error(bitlyResponse.status_txt);
        }
      } catch(err) {
        console.log('Failed to call bitly for link shortening, using long link');
      }
    }

    console.log(link);
    alert('Check the console for your share link'); // TODO display a popup in the screen and allow copying to clipboard using something like https://clipboardjs.com/
  }
};

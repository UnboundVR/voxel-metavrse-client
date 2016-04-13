module.exports = {
  SERVER_ADDRESS() {
    return window.SERVER_ADDRESS || process.env.SERVER_ADDRESS;
  },
  events: {
    HOVER: 'Hover',
    LEAVE: 'Leave',
    INTERACT: 'Interact',
    PLACE_ADJACENT: 'PlaceAdjacent',
    REMOVE_ADJACENT: 'RemoveAdjacent',
    FULLSCREEN_WINDOW_OPEN: 'FullScreenWindowOpen',
    FULLSCREEN_WINDOW_CLOSE: 'FullScreenWindowClose'
  },
  github: {
    REQUESTED_SCOPE: 'user,gist',
    API_URL: 'https://api.github.com',
    OAUTH_URL: 'https://github.com/login/oauth'
  }
};

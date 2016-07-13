module.exports = {
  SERVER_ADDRESS() {
    return window.SERVER_ADDRESS || process.env.SERVER_ADDRESS;
  },
  events: {
    HOVER: 'hover',
    LEAVE: 'leave',
    INTERACT: 'interact',
    PLACE_ADJACENT: 'placeAdjacent',
    REMOVE_ADJACENT: 'removeAdjacent',
    FULLSCREEN_WINDOW_OPEN: 'fullScreenWindowOpen',
    FULLSCREEN_WINDOW_CLOSE: 'fullScreenWindowClose',
    CODE_UPDATED: 'codeUpdated',
    EDIT_CODE: 'editCode'
  },
  github: {
    REQUESTED_SCOPE: 'user,gist',
    API_URL: 'https://api.github.com',
    OAUTH_URL: 'https://github.com/login/oauth'
  },
  coding: {
    OPERATIONS: {
      UPDATE: 'update',
      CREATE: 'create',
      FORK: 'fork'
    }
  }
};

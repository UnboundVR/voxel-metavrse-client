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
    EDIT_CODE: 'editCode',
    OPEN_CHUNK_PERMISSIONS: 'openChunkPermissions',
    SHARE_LOCATION: 'shareLocation',
    OPEN_INVENTORY: 'openInventory',
    TOGGLE_CAMERA: 'toggleCamera',
    PLACE_BLOCK: 'placeBlock',
    CHANGE_TOOLBAR_ITEM: 'changeToolbarItem'
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

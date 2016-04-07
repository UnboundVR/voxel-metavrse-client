import events from '../events';
import consts from '../constants';
import map from '../map';

var blockObjs = {};
var supportedEvents = [
  consts.events.HOVER,
  consts.events.LEAVE,
  consts.events.INTERACT,
  consts.events.PLACE_ADJACENT,
  consts.events.REMOVE_ADJACENT
];

supportedEvents.forEach(eventName => {
  events.on(eventName, function(payload, filter) {
    Object.keys(blockObjs).forEach(key => {
      var block = blockObjs[key];
      block.emit(eventName, payload, filter);
    });
  });
});

var create = function(position, prototype) {
  var obj = buildBlockObject(position, prototype);
  blockObjs[position] = obj;
  subscribeToEvents(obj);
};

var remove = function(position) {
  var obj = blockObjs[position];
  if(obj) {
    unsubscribeToEvents(obj);
    if(obj.onDestroy) {
      obj.onDestroy();
    }
    delete blockObjs[position];
  }
};

function buildBlockObject(position, prototype) {
  var Block = function(position) {
    this.position = position;
    this.map = map;
  };

  Block.prototype = prototype;
  var obj = new Block(position);

  if(obj.init) {
    obj.init();
  }

  return obj;
}

function subscribeToEvents(obj) {
  supportedEvents.forEach(eventName => {
    var handlerName = 'on' + eventName;
    var handler = obj[handlerName];
    if(handler) {
      obj.on(eventName, (payload, filter) => {
        if(!filter || !filter.position || obj.position.join('|') == filter.position.join('|')) {
          handler.bind(obj)(payload);
        }
      });
    }
  });
}

function unsubscribeToEvents(obj) {
  supportedEvents.forEach(eventName => {
    obj.removeAllListeners(eventName);
  });
}

export default {
  create,
  remove
};

import events from '../events';
import util from 'util';
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

var update = function(position, code) {
  remove(position);
  create(position, code);
};

var remove = function(position) {
  var obj = blockObjs[position];
  if(obj) {
    // TODO send event to block telling its's dead
    unsubscribeToEvents(obj);
    delete blockObjs[position];
  }
};

function buildBlockObject(position, prototype) {
  var Block = function(position) {
    this.position = position;
    this.map = map;
    prototype.call(this);
  };
  util.inherits(Block, prototype);

  var obj = new Block(position);
  console.log(obj)
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
  update,
  remove
};

import events from '../events';
import consts from '../constants';
import EventEmitter2 from 'eventemitter2';
import util from 'util';
import pointerLock from '../pointerLock';

const CODING_WINDOW = 'coding';

var dirty = false;
var onSave;

var doClose = function() {
  pointerLock.request();
  events.emit(consts.events.FULLSCREEN_WINDOW_CLOSE, {name: CODING_WINDOW});
};

var save = function(value) {
  console.log('saving...');
  onSave(value, false);
  doClose();
  onSave = undefined;
};

var saveAs = function(value) {
  console.log('saving as...');
  onSave(value, true);
  doClose();
  onSave = undefined;
};


var close = function() {
  if(!dirty || confirm('Exit without saving?')) {
    doClose();
  }
};

var open = function(data) {
  this.emit('open', data);
  pointerLock.release();
  events.emit(consts.events.FULLSCREEN_WINDOW_OPEN, {name: CODING_WINDOW});

  return new Promise(resolve => {
    onSave = resolve;
  });
};

function Editor() {
  this.save = save.bind(this);
  this.saveAs = saveAs.bind(this);
  this.close = close.bind(this);
  this.open = open.bind(this);
  this.onChange = function() {
    dirty = true;
  };
  this.markClean = function() {
    dirty = false;
  };
}

util.inherits(Editor, EventEmitter2.EventEmitter2);
export default new Editor();

import events from '../events';
import consts from '../constants';
import EventEmitter2 from 'eventemitter2';
import util from 'util';
import pointerLock from '../pointerLock';
import clone from 'clone';

const CODING_WINDOW = 'coding';

let dirty = false;
let onSave;

function test(type, position, code, item) {
  events.emit(consts.events.TEST_CODE, {type, position, code, item});
}

function doClose() {
  pointerLock.request();
  events.emit(consts.events.FULLSCREEN_WINDOW_CLOSE, {name: CODING_WINDOW});
}

function save(value) {
  onSave({value});
  doClose();
  onSave = undefined;
}

function saveAs(value, name) {
  if(!name) {
    name = 'Unnamed';
  }
  onSave({value, name});
  doClose();
  onSave = undefined;
}

function close() {
  if(!dirty || confirm('Exit without saving?')) {
    doClose();
    return true;
  }
}

function open(data) {
  this.emit('open', clone(data));
  pointerLock.release();
  events.emit(consts.events.FULLSCREEN_WINDOW_OPEN, {name: CODING_WINDOW});

  return new Promise(resolve => {
    onSave = resolve;
  });
}

function Editor() {
  this.save = save.bind(this);
  this.saveAs = saveAs.bind(this);
  this.close = close.bind(this);
  this.open = open.bind(this);
  this.test = test.bind(this);
  this.onChange = () => {
    dirty = true;
    this.emit('markedDirty');
  };
  this.markClean = () => {
    dirty = false;
  };
  this.markDirty = () => {
    dirty = true;
  };
}

util.inherits(Editor, EventEmitter2.EventEmitter2);
export default new Editor();

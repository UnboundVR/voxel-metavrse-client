import io from 'socket.io-client';
import EventEmitter2 from 'eventemitter2';
import util from 'util';
import consts from '../constants';

let initialized = false;
let pendingMessages = [];

function ChatService() {
  this.init = function() {
    this.socket = io.connect(consts.SERVER_ADDRESS() + '/chat');
    this.socket.on('message', message => {
      this.emit('message', message);
    });
  };

  this.loadPendingMessages = function() {
    initialized = true;

    for(let message of pendingMessages) {
      this.emit('debugMessage', message);
    }
  }

  this.destroy = function() {
    this.socket.destroy();
  };

  this.sendMessage = function(message) {
    this.socket.emit('message', message);
  };

  this.debugMessage = function(text) {
    this._debugMessage(text, 'debug');
  };

  this.errorMessage = function(text) {
    this._debugMessage(text, 'error');
  };

  this.verboseMessage = function(text) {
    this._debugMessage(text, 'verbose');
  };

  this._debugMessage = function(text, type) {
    let message = {type: 'info', text, date: new Date(), user: 'System'};
    if(initialized) {
      this.emit('debugMessage', message);
    } else {
      pendingMessages.push(message);
    }
  };
}


util.inherits(ChatService, EventEmitter2.EventEmitter2);
export default new ChatService();

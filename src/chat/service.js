import io from 'socket.io-client';
import EventEmitter2 from 'eventemitter2';
import util from 'util';
import consts from '../constants';

function ChatService() {
  this.init = function() {
    var self = this;
    this.socket = io.connect(consts.SERVER_ADDRESS() + '/chat');
    this.socket.on('message', message => {
      self.emit('message', message);
    });
  };

  this.destroy = function() {
    this.socket.destroy();
  };

  this.sendMessage = function(message) {
    this.socket.emit('message', message);
  };

  this.debugMessage = function(text) {
    this.emit('debugMessage', {type: 'info', text, date: new Date(), user: 'System'});
  }

  this.errorMessage = function(text) {
    this.emit('debugMessage', {type: 'error', text, date: new Date(), user: 'System'});
  }
}

util.inherits(ChatService, EventEmitter2.EventEmitter2);
export default new ChatService();

<template lang="html">
  <ui-tabs id="chat-component"  type="text" background-color="clear">
    <ui-tab header="Chat">
      <ul id="chat-component-message-list" v-el:message-list v-bind:class="[ css.chat.isChatFocused ? css.chat.chatFocused : css.chat.chatNotFocused ]">
        <message v-for="message in messageList" track-by='uuid' :message="message"></message>
      </ul>
      <div id="chat-component-messagebox-wrapper">
        <input
        type="text"
        :disabled="!css.chat.isChatFocused"
        id="chat-component-messagebox-input"
        v-model="newMessage"
        placeholder="Press <enter> to chat"
          v-el:message-input />
      </div>
    </ui-tab>
    <ui-tab header="System">
      <ul id="chat-component-message-list-debug" v-el:message-list-debug>
        <debug-message v-for="debugMessage in messageListDebug" track-by="$index" :debug="debugMessage"></debug-message>
      </ul>
    </ui-tab>
  </ui-tabs>
</template>

<script>
import auth from './../auth/';
import service from './service';
import events from '../events';
import pointerLock from '../pointerLock';
import consts from '../constants';
import Message from './components/Message.vue';
import DebugMessage from './components/DebugMessage.vue';
import Vue from 'vue';
import uuid from 'uuid';
import { UiTabs, UiTab } from 'keen-ui';

export default {
  name: 'ChatComponent',
  components: {
    Message,
    DebugMessage,
    UiTabs,
    UiTab,
  },
  data() {
    return {
      messageList: [],
      messageListDebug: [],
      newMessage: '',
      css: {
        chat: {
          isChatFocused: false,
          chatNotFocused: 'chat-component-not-focus',
          chatFocused: 'chat-component-focus'
        }
      },
    };
  },
  methods: {
    enableEnterHandler() {
      window.addEventListener('keyup', this.enterHandler);
    },
    disableEnterHandler() {
      window.removeEventListener('keyup', this.enterHandler);
    },
    enterHandler(e) {
      if (e.keyCode !== 13) return;

      var el = this.$els.messageInput;
      if (document.activeElement === this.$parent.$el || document.activeElement === 'null' || document.activeElement === undefined) {
        pointerLock.release();
        this.css.chat.isChatFocused = true;
        Vue.nextTick(() => el.focus());
      } else if (document.activeElement === el) {
        if (this.newMessage === '' || this.newMessage === null || el.value === '') {
          el.blur();
          this.css.chat.isChatFocused = false;
          pointerLock.request();
        } else if (this.newMessage !== '' || el.value !== '') {
          var username = auth.getName() || 'Guest';
          var message = { uuid: uuid.v4(), date: Date.now(), user: username, text: this.newMessage };
          this.addMessage(message);
          service.sendMessage(message);
          this.newMessage = ''; // TODO: See why the hell this doesn't update the model and we have to use this thing below --v
          el.value = '';
          this.css.chat.isChatFocused = false;
          el.blur();
          pointerLock.request();
        }
      }
    },
    addMessage(message) {
      this.messageList.push(message);
    },
    addDebugMessage(message) {
      this.messageListDebug.push(message);
    },
  },
  ready() {
    service.init();
    service.on('message', this.addMessage);
    service.on('debugMessage', this.addDebugMessage);
    this.enableEnterHandler();

    events.on(consts.events.FULLSCREEN_WINDOW_OPEN, this.disableEnterHandler);
    events.on(consts.events.FULLSCREEN_WINDOW_CLOSE, this.enableEnterHandler);

    service.loadPendingMessages();
    setTimeout(() => this.scrollToBottom(), 100);
  },
  destroyed() {
    this.disableEnterHandler();
    service.removeAllListeners('message');
    service.destroy();
  },
  watch: {
    'messageList': function() {
      this.$nextTick(() => {
        this.$els.messageList.scrollTop = this.$els.messageList.scrollHeight;
      })
    },
    'messageListDebug': function() {
      this.$nextTick(() => {
        this.$els.messageListDebug.scrollTop = this.$els.messageListDebug.scrollHeight;
      })
    }
  }
};
</script>

<style lang="scss">

$chat-font-size: "10px";
$chat-font-family: "Open Sans", sans-serif;

#chat-component {
  position: absolute;
  padding: 10px;
  bottom: 15px;
  left: 10px;
  width: 30%;
  height: 320px;
  margin: 0;
  padding: 0;

  .ui-tabs-body {
    border: none;
    padding: 0px;
    background-color: rgba(20, 20, 20, 0.2);
  }

  #chat-component-messagebox-wrapper {
    height: 20px;
    width: 100%;
    position: absolute;
    bottom: 5px;

    #chat-component-messagebox-input {
      height: 20px;
      box-shadow: none;
      padding: 0;
      margin: 0;
      background: none;
      border: none;
      border-radius: 0;
      color: #FFFFFF;
      font-family: $chat-font-family;
      font-size: $chat-font-size;

      &:focus {
        outline: none;
      }
    }
  }
}

.chat-component-not-focus {
  background-color: rgba(20, 20, 20, 0.2);
  border: 1px solid rgba(240, 240, 240, 0.03);
}

.chat-component-focus {
  background-color: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(240, 240, 240, 0.1);
}
</style>

<template>
  <div id="chat-component" v-bind:class="[ css.chat.isChatFocused ? css.chat.chatFocused : css.chat.chatNotFocused ]">
    <ul id="chat-component-message-list" v-el:message-list>
      <li class="chat-component-message-list-message" v-for='message in messageList'>
        <span class="chat-component-message-list-message-user" v-el:messageuser>{{ message.user }}</span><span>:
        <span class="chat-component-message-list-message-message">{{ message.text }}</span>
        <ui-tooltip :trigger="$els.messageuser" :position="tooltipPosition" :content="message.date | moment 'dddd, h:mm:ss a'"></ui-tooltip>
      </li>
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
  </div>
</template>

<script>
import auth from './../auth/';
import service from './service';
import events from '../events';
import pointerLock from '../pointerLock';
import consts from '../constants';
import Vue from 'vue';
import { UiTooltip } from 'keen-ui';

export default {
  name: 'ChatComponent',
  components: {
    'ui-tooltip': UiTooltip,
  },
  data() {
    return {
      messageList: [],
      newMessage: '',
      css: {
        chat: {
          isChatFocused: false,
          chatNotFocused: 'chat-component-not-focus',
          chatFocused: 'chat-component-focus'
        }
      },
      tooltipPosition: 'top center',
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
          var message = { date: Date.now(), user: username, text: this.newMessage };
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
      this.scrollToBottom();
    },
    scrollToBottom() {
      // TODO: Scroll to the bottom of the list somehow.
    }
  },
  ready() {
    service.init();
    service.on('message', this.addMessage);
    service.on('debugMessage', this.addMessage);
    this.enableEnterHandler();

    events.on(consts.events.FULLSCREEN_WINDOW_OPEN, this.disableEnterHandler);
    events.on(consts.events.FULLSCREEN_WINDOW_CLOSE, this.enableEnterHandler);
  },
  destroyed() {
    this.disableEnterHandler();
    service.removeAllListeners('message');
    service.destroy();
  }
};
</script>

<style lang="scss">

$chat-font-size: "12px";
$chat-font-family: 'Open Sans', sans-serif;
$chat-component-height: 290px;
$chat-message-box-height: 30px;
$chat-message-list-height: 290px - 30px;

#chat-component {
  position: absolute;
  padding: 10px;
  bottom: 50px;
  left: 10px;
  width: 30%;
  height: $chat-component-height;

  ul#chat-component-message-list {
    height: $chat-message-list-height;
    overflow-y: auto;
    list-style: none;

    li.chat-component-message-list-message {
      color: #FFFFFF;
      font-family: $chat-font-family;
      font-size: $chat-font-size;
      overflow: none;

      .chat-component-message-list-message-user {
        text-decoration: underline;
      }
    }
  }

  #chat-component-messagebox-wrapper {
    height: $chat-message-box-height;
    width: 100%;
    position: absolute;
    bottom: 0;

    #chat-component-messagebox-input {
      height: 20px;
      box-shadow: none;
      padding: 0px 10px;
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

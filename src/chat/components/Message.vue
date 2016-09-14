<template lang="html">
  <li class="chat-component-message-list-message">
    <span class="chat-component-message-list-message-user" v-el:messageuser>{{ message.user }}</span><span>:
    <span class="chat-component-message-list-message-message">{{ message.text }}</span>
    <ui-tooltip :trigger="$els.messageuser" :position="tooltipPosition" :content="message.date | moment 'dddd, h:mm:ss a'"></ui-tooltip>
  </li>
</template>

<script>
import { UiTooltip } from 'keen-ui';

export default {
  data() {
    return {
      tooltipPosition: 'top center',
    }
  },
  props: ['message'],
  components: {
    UiTooltip,
  },
}
</script>

<style lang="scss">

$chat-font-size: "10px";
$chat-font-family: "Open Sans", sans-serif;

ul#chat-component-message-list {
  height: 240px;
  overflow-y: auto;
  list-style: none;
  color: #000;

  li.chat-component-message-list-message {
    color: #FFFFFF;
    font-family: $chat-font-family;
    font-size: $chat-font-size;
    overflow: none;
    padding-bottom: 2px;

    .chat-component-message-list-message-user {
      text-decoration: underline;
    }
  }
}

</style>

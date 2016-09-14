<template lang="html">
  <li class="chat-component-message-list-message-debug">
    <span class="chat-component-message-list-message-message-debug" v-el:debugtext>{{ debug.text }}</span>
    <ui-tooltip :trigger="$els.debugtext" :position="tooltipPosition" :content="debug.date | moment 'dddd, h:mm:ss a'"></ui-tooltip>
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
  props: ['debug'],
  components: {
    UiTooltip,
  },
}
</script>

<style lang="scss">

$chat-font-size: "10px";
$chat-font-family: "Open Sans", sans-serif;

ul#chat-component-message-list-debug {
  height: 240px;
  overflow-y: auto;
  list-style: none;
  color: #000;

  li.chat-component-message-list-message-debug {
    color: #FFFFFF;
    font-family: $chat-font-family;
    font-size: $chat-font-size;
    overflow: none;
    padding-bottom: 2px
  }
}

</style>

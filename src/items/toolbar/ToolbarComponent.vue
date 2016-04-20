<template>
  <nav v-show="userLogged" id="toolbar-component" class="bar-tab">
    <ul class="tab-inner">
      <li v-for="item in items" track-by="$index" class="tab-item" v-bind:class="{'active': $index === 0}">
        <div v-if="item.name">
          <img class="tab-icon" v-bind:src="'assets/img/icons/' + item.icon + '.png'">
          <div class="tab-label" data-id="{{$index}}">{{ item.name }}</div>
        </div>
        <div v-else>
          <div class="tab-label" data-id="{{$index}}">Nothing ({{ $index+1 }})</div>
        </div>
      </li>
    </ul>
  </nav>
  <div id="crosshair"><img v-bind:src="'assets/img/crosshairs/' + crosshairIcon + '.png'"/></div>
</template>

<script>

import service from './service';

export default {
  name: 'ToolbarComponent',
  data(){
    return service;
  },
  computed: {
    crosshairIcon() {
      return this.deleteMode ? 'delete' : this.selectedItem.crosshairIcon;
    }
  },
  ready() {
    service.hookSelection();
  },
  destroyed() {
    service.unhookSelection();
  }
};
</script>

<style lang="scss">
@import '../../../assets/css/_toolbar';

.bar-tab {
  right: 33% !important;
  left: 33% !important;
}

#crosshair {
    position: fixed;
    top: 50%;
    left: 50%;
    margin: -16px 0 0 -16px;
    width: 32px;
    height: 32px;
}
</style>

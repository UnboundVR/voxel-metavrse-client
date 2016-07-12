<template>
  <nav v-show="userLogged" id="toolbar-component" class="bar-tab">
    <ul class="tab-inner">
      <li @contextMenu="code($event, item, $index)" v-for="item in items" track-by="$index" class="tab-item" v-bind:class="{'active': $index === 0}">
        <div v-if="item.name">
          <img class="tab-icon" v-bind:src="'assets/img/icons/' + item.icon + '.png'">
          <div v-bind:class="[ !!item.newerVersion ? 'outdated' : '' ]" class="tab-label" data-id="{{$index}}">
            <span>{{ item.name }}</span>
            <span v-if="!!item.newerVersion">(#{{ item.id }})</span>
          </div>
        </div>
        <div v-else>
          <div class="tab-label" data-id="{{$index}}">Nothing</div>
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
  methods: {
    code($event, item, idx) {
      service.editCode(item, idx - 1);
      $event.preventDefault();
    }
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
  user-select: none;
  cursor: pointer;

  .outdated {
    color: #ff0000;
  }
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

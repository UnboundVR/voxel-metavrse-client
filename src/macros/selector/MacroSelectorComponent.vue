<template>
  <div id="macro-selector-component">
    <h1>Macros</h1>
    <div v-for="item in items">
      <button @click="selectMain(item, $event)">{{ item.name }}</button>
    </div>
  </div>
</template>

<script>

import service from './service';

export default {
  name: 'MacroSelectorComponent',
  data() {
    return {
      items: service.getMacros()
    };
  },
  methods: {
    selectMain(item) {
      service.selectMain(item);
    }
  }
};
</script>

<style lang="scss">
#macro-selector-component {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>

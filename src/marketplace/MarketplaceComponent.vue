<template>
  <div v-show="isOpen" id="marketplace">
    <div id="content">
      <h1>Marketplace</h1>

      <h2>Items</h2>
      <ul>
        <li v-for="item in allItemTypes" class="item">
          <img class="icon" :src="'assets/img/icons/' + item.icon + '.png'">
          <div>{{ item.name }}</div>
        </li>
      </ul>

      <h2>Blocks</h2>
      <ul>
        <li v-for="block in allBlockTypes" class="item">
          <img class="icon" :src="'assets/img/icons/' + block.icon + '.png'">
          <div>{{ block.name }}</div>
        </li>
      </ul>

      <div v-el:close class="closeButton" @click="closeMarketplace"></div>
    </div>
  </div>
</template>

<script>
import controller from './controller';

export default {
  name: 'MarketplaceComponent',
  data() {
    return controller;
  },
  methods: {
    closeMarketplace() {
      controller.close();
    }
  },
  ready() {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', 32);
    svg.setAttribute('height', 32);
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 12,12 L 22,22 M 22,12 12,22');
    path.setAttribute('stroke', '#fff');
    svg.appendChild(path);
    this.$els.close.appendChild(svg);
  },
  destroyed() {

  }
};
</script>

<style lang="scss">
  #marketplace {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.9;
    color: #ffffff;
    background-color: #000000;

    #content {
      margin: 20px;
    }

    .closeButton {
      position: absolute;
      top: 3px;
      right: 1px;
      cursor: pointer;
    }

    .item {
      display: inline-block;
      margin: 10px;
      text-align: center;

      .icon {
        width: 64px;
        height: 64px;
      }
    }
  }
</style>

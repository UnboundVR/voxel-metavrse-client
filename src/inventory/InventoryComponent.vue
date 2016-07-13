<template>
  <div v-show="isOpen" id="inventory">
    <div id="content">
      <h1>Inventory</h1>

      <h2>Items</h2>
      <ul>
        <li @contextMenu="launchCodeEdit($event, item, 'item')" v-for="item in allItemTypes" v-if="!inToolbar(item, false)" class="item" @click="addToToolbar('item', item.id)">
          <img class="icon" :src="'assets/img/icons/' + item.icon + '.png'">
          <div v-bind:class="[ !!item.newerVersion ? 'outdated' : '' ]">
            <span>{{ item.name }}</span>
            <span v-if="!!item.newerVersion">(#{{ item.id }})</span>
          </div>
        </li>
      </ul>

      <h2>Blocks</h2>
      <ul>
        <li @contextMenu="launchCodeEdit($event, block, 'block')" v-for="block in allBlockTypes" v-if="!inToolbar(block, true)" class="item" @click="addToToolbar('block', block.id)">
          <img class="icon" :src="'assets/img/icons/' + block.icon + '.png'">
          <div v-bind:class="[ !!block.newerVersion ? 'outdated' : '' ]">
            <span>{{ block.name }}</span>
            <span v-if="!!block.newerVersion">(#{{ block.id }})</span>
          </div>
        </li>
      </ul>

      <h2>Toolbar</h2>
      <ul>
        <li @contextMenu="launchCodeEdit($event, item, item.type, $index - 1)" v-for="item in toolbarItems" track-by="$index" class="item" @click="removeFromToolbar($index, item.type, item.id)">
          <div>
            <img v-if="item.icon" class="icon" :src="'assets/img/icons/' + item.icon + '.png'">
            <div v-else class="nothing"></div>

            <div v-if="item.name" v-bind:class="[ !!item.newerVersion ? 'outdated' : '' ]">
              <span>{{ item.name }}</span>
              <span v-if="!!item.newerVersion">(#{{ item.id }})</span>
            </div>
            <div v-else>Nothing</div>
          </div>
          <span>({{ $index + 1 }})</span>
        </li>
      </ul>

      <div v-el:close class="closeButton" @click="closeInventory"></div>
    </div>
  </div>
</template>

<script>
import controller from './controller';

export default {
  name: 'InventoryComponent',
  data() {
    return controller;
  },
  methods: {
    closeInventory() {
      controller.close();
    },
    inToolbar(item, isBlock) {
      return this.toolbarItems.filter(i => !!i.isBlock == isBlock).map(i => i.id).includes(item.id);
    },
    launchCodeEdit($event, item, type, toolbar) {
      $event.preventDefault();
      if(toolbar > 0) {
        controller.editCode(item, type, toolbar);
      }
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
  #inventory {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.9);

    #content {
      margin: 15px;
    }

    .closeButton {
      position: absolute;
      top: 3px;
      right: 1px;
      cursor: pointer;
    }

    .outdated {
      color: #ff0000;
    }

    .item {
      display: inline-block;
      margin: 10px;
      padding: 5px;
      width: 90px;
      height: 100px;
      text-align: center;
      cursor: pointer;
      outline: 1px dashed #ccc;

      .icon {
        width: 64px;
        height: 64px;
      }

      .nothing {
        width: 64px;
        height: 69px;
      }
    }
  }
</style>

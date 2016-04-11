<template>
  <div v-show="open" id="scripting">
    <div class="scripting-header">
      <h1 v-if="blockType">Editing the code of {{blockType.name}} block <span v-if="position">at ({{position}})</span> <img class="block-icon" :src="'assets/img/icons/' + blockType.icon + '.png'"></src></h1>
      <h1 v-else>Editing the code of new block at ({{position}})</h1>

      <div v-el:close class="closeButton" @click="close"></div>
    </div>
    <div class="scripting-content" v-el:content>
      <div class="scripting-sidebar">
        <div class="sidebar-content">
          <div class="actions">
            <button v-if="blockType && mine" @click="save">Save</button>
            <button v-if="blockType" @click="saveAs">Fork...</button>
            <button v-if="!blockType" @click="saveAs">Save as...</button>
          </div>

          <div v-if="blockType">
            <div class="author-info">
              Author: {{blockType.code.author.login}} <span v-if="mine">(a.k.a. you)</span> <img class="author-avatar" :src="blockType.code.author.avatar"></src>
            </div>
            <a target="_blank" :href="blockType.code.url">Go to gist</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import editor from './editor';
import auth from '../auth';
import Vue from 'vue';

var codemirror;
var wrapper;
var stopPropagation =  e => {
  e.stopPropagation();
};

export default {
  name: 'CodingComponent',
  data() {
    return {
      position: '',
      blockType: null,
      open: false,
      mine: false
    };
  },
  methods: {
    save() {
      this.open = false;
      editor.save(codemirror.getValue());
    },
    saveAs() {
      var name = prompt('Enter the name of the new block');
      if(!name) {
        return;
      }

      this.open = false;
      editor.saveAs(codemirror.getValue(), name);
    },
    close() {
      this.open = false;
      editor.close();
    }
  },
  ready() {
    var self = this;

    codemirror = CodeMirror(self.$els.content, {
      value: '',
      mode: 'javascript',
      lineNumbers: true,
      matchBrackets: true,
      indentWithTabs: true,
      tabSize: 2,
      indentUnit: 2,
      hintOptions: {
        completeSingle: false
      }
    });

    codemirror.on('change', editor.onChange);
    codemirror.setOption('theme', 'tomorrow-night-bright');

    wrapper = codemirror.getWrapperElement();
    wrapper.addEventListener('keydown', stopPropagation);

    editor.on('open', data => {
      self.open = true;
      self.position = data.position.join('|');
      self.blockType = data.blockType;
      self.mine = data.blockType && data.blockType.code.author.id == auth.getUserId();

      Vue.nextTick(() => {
        codemirror.setValue(data.blockType ? data.blockType.code.code : data.code);
        editor.markClean();
        codemirror.focus();
      });
    });

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
    editor.removeAllListeners('open');
    wrapper.removeEventListener('keydown', stopPropagation);
  }
};
</script>

<style lang="scss">
#scripting {
  display: block;
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  opacity: 0.9;

  .scripting-header {
    padding: 7px;
    width: 100%;
    background: #000;
    color: #fff;
    border-bottom: 1px solid #111;

    .block-icon {
      border-radius: 25px;
      width: 32px;
      height: 32px;
      vertical-align: middle;
    }

    .closeButton {
      position: absolute;
      top: 3px;
      right: 1px;
      cursor: pointer;
    }
  }

  .scripting-content {
    width: 100%;
    height: 100%;

    .CodeMirror {
      height: 100% !important;
      width: 80%;
    }

    .scripting-sidebar {
      width: 20%;
      height: 100%;
      float: right;
      background: #000;
      color: #fff;
      box-shadow: 1px 0 0 #111 inset;

      .sidebar-content {
        position: inherit;
        padding-left: 15px;
        padding-top: 15px;

        .author-info {
          display: block;

          .author-avatar {
            border-radius: 25px;
            width: 32px;
            height: 32px;
            vertical-align: middle;
          }
        }
      }
    }
  }

}
</style>

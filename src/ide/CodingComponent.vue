<template>
  <div v-show="open" id="scripting">
    <div class="scripting-header">

      <h1>
        <span v-if="item">Editing the code of {{type}} {{item.name}} (#{{item.id}})</span>
        <span v-else>Editing the code of new {{type}}</span>

        <span v-if="position"> at ({{position}})</span>
        <span v-if="toolbar"> from toolbar #{{toolbar}}</span>

        <img v-if="item" class="item-icon" :src="'assets/img/icons/' + item.icon + '.png'">
      </h1>

      <div v-el:close class="closeButton" @click="close"></div>
    </div>
    <div class="scripting-content" v-el:content>
      <div class="scripting-sidebar">
        <div class="sidebar-content">
          <div class="actions">
            <button v-if="item && mine && !outdated" @click="save">Save</button>
            <button v-if="item" @click="saveAs">Fork...</button>
            <button v-if="!item" @click="saveAs">Save as...</button>
            <a v-if="item" target="_blank" :href="code.url">Go to gist</a>
          </div>

          <div v-if="item">
            <div class="author-info">
              <h2>{{capitalizedType}} owner</h2>
              <div>{{item.owner}} <span v-if="mine">(a.k.a. you)</span></div>

              <h2>Gist Author</h2>
              <div>{{code.author.id}} <img class="author-avatar" :src="code.author.avatar"></div>
            </div>
            <div class="gist-info">
              <h2>Gist info</h2>
              <ul>
                <li>ID: {{code.id}}</li>
                <li>Revision: {{code.revision.id}}</li>
                <li>Revision date: {{code.revision.date | moment "DD/MM/YYYY h:mm:ss A"}}</li>
                <li v-if="outdated">
                  <span class="outdated">Newer version with ID {{item.newerVersion}}</span>
                  <div class="actions">
                    <button v-if="toolbar || position" @click="update()">Update</button>
                  </div>
                </li>
                <li v-if="!outdated && codeHasForks"><span class="outdated">Possibly external forks/updates at {{code.lastUpdateDate | moment "DD/MM/YYYY h:mm:ss A"}}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import editor from './editor';
import auth from '../auth';
import consts from '../constants';
import events from '../events';
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
      position: null,
      toolbar: null,
      item: null,
      code: null,
      open: false,
      type: null
    };
  },
  computed: {
    outdated() {
      return !!this.item.newerVersion;
    },
    codeHasForks() {
      return this.code.revision.date != this.code.lastUpdateDate;
    },
    mine() {
      let currentUser = auth.getUserId();
      return currentUser == this.item.owner && (!this.code || currentUser == this.code.author.id);
    },
    capitalizedType() {
      return this.type.charAt(0).toUpperCase() + this.type.slice(1);
    }
  },
  methods: {
    save() {
      this.open = false;
      editor.save(codemirror.getValue());
    },
    saveAs() {
      var name = prompt(`Enter the name of the new ${this.type}`);
      if(!name) {
        return;
      }

      this.open = false;
      editor.saveAs(codemirror.getValue(), name);
    },
    close() {
      if(editor.close()) {
        this.open = false;
        this.item = null;
        this.code = null;
        this.type = null;
        this.position = null;
        this.toolbar = null;
      }
    },
    update() {
      if(this.position) {
        events.emit(consts.events.PLACE_BLOCK, {position: this.position, block: this.item.newerVersion});
      } else {
        events.emit(consts.events.CHANGE_TOOLBAR_ITEM, {position: this.toolbar - 1, item: this.item.newerVersion, type: this.type});
      }

      this.close();
    }
  },
  ready() {
    var self = this;

    codemirror = CodeMirror(self.$els.content, {
      value: '',
      mode: 'javascript',
      lineNumbers: true,
      matchBrackets: true,
      tabSize: 2,
      indentUnit: 2,
      hintOptions: {
        completeSingle: false
      },
      gutters: ['CodeMirror-lint-markers'],
      lint: true
    });

    codemirror.on('change', editor.onChange);
    codemirror.setOption('theme', 'tomorrow-night-bright');

    wrapper = codemirror.getWrapperElement();
    wrapper.addEventListener('keydown', stopPropagation);

    editor.on('open', data => {
      self.open = true;
      self.position = data.position && data.position.join('|');
      self.toolbar = data.toolbar !== undefined && data.toolbar + 1;
      self.item = data.item;
      self.code = data.code;
      self.type = data.type;

      Vue.nextTick(() => {
        codemirror.setValue(data.item ? data.code.code : data.code);
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

  .actions {
    margin-bottom: 10px;

    button,a {
      color: #fff;
      background-color: #6496c8;
      text-shadow: -1px 1px #417cb8;
      border: none;
      border: solid 5px #6496c8;
      text-decoration: none; font: menu;
      display: inline-block;
      padding: 2px 5px;
    }

    button:hover,a:hover {
      background-color: #346392;
      text-shadow: -1px 1px #27496d;
      border-color: #346392;
    }

    button:active,a:active {
      background-color: #27496d;
      text-shadow: -1px 1px #193047;
      border-color: #27496d;
    }
  }

  .scripting-header {
    padding: 7px;
    width: 100%;
    background: #000;
    color: #fff;
    border-bottom: 1px solid #111;

    .item-icon {
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
          margin-bottom: 10px;

          .author-avatar {
            border-radius: 25px;
            width: 32px;
            height: 32px;
            vertical-align: middle;
          }
        }

        .gist-info {
          margin-bottom: 10px;

          li {
            list-style: none;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .outdated {
            font-style: italic;
            font-weight: bold;
          }
        }
      }
    }
  }

}
</style>

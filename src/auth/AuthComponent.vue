<template>
  <div id="auth-component">
    <nav id="auth-component-menu" class="css_menu">
      <ul v-if="loggedIn">
        <li>
          <img id="auth-component-avatar" :src="avatarUrl" />
          <ul>
            <li><a href="#" @click="goToProfile">{{ name }}</a></li>
            <li><a href="#" @click="logout">Logout</a></li>
          </ul>
        </li>
        <li>
          <ui-fab type="normal" color="primary" icon="settings"></ui-fab>
          <ul>
            <li><a href="#" @click="toggleCamera">Toggle camera</a></li>
            <li><a href="#" @click="chunkPermissions">Chunk permissions</a></li>
            <li><a href="#" @click="clearTestingCode">Clear testing code</a></li>
          </ul>
        </li>
      </ul>
      <ul v-else>
        <li><a href="#" @click="login">Login</a></li>
      </ul>
    </nav>
    <ui-fab type="normal" color="primary" icon="apps" tooltip="Inventory" @click="inventory"></ui-fab>
    <ui-fab type="normal" color="primary" icon="link" tooltip="Share location" @click="shareLocation"></ui-fab>
    <ui-fab type="normal" color="primary" icon="info" tooltip="Info" @click="info"></ui-fab>
    <ui-fab type="normal" color="primary" icon="bug_report" tooltip="Report bug" @click="reportBug"></ui-fab>
  </div>
</template>

<script>

import service from './service';
import consts from '../constants';
import events from '../events';
import chat from '../chat';
import { UiFab } from 'keen-ui';

export default {
  name: 'AuthComponent',
  data() {
    return {
      loggedIn: service.isLoggedIn(),
      name: service.getName(),
      avatarUrl: service.getAvatarUrl() + '&s=48'
    };
  },
  components: {
    UiFab
  },
  methods: {
    login: service.login,
    logout: service.logout,
    inventory() {
      events.emit(consts.events.OPEN_INVENTORY);
    },
    toggleCamera() {
      events.emit(consts.events.TOGGLE_CAMERA);
    },
    shareLocation() {
      events.emit(consts.events.SHARE_LOCATION);
    },
    chunkPermissions() {
      events.emit(consts.events.OPEN_CHUNK_PERMISSIONS);
    },
    clearTestingCode() {
      events.emit(consts.events.WIPE_TESTING_CODE, {all: true});
    },
    goToProfile() {
      chat.debug('Soon');
    },
    reportBug() {
      chat.debug('Soon');
    },
    info() {
      chat.debug('Soon');
    }
  }
};
</script>

<style lang='scss'>

@import '../../assets/css/_cssmenu';

#auth-component {
  position: absolute;
  top: 10px;
  left: 10px;

  display: flex;
  margin-bottom: 16px;
  align-items: flex-end;
  flex-wrap: wrap;

  .ui-fab {
    margin-right: 15px;
  }

  #auth-component-avatar {
    border-radius: 25px;
    margin-right: 15px;
  }
}

</style>

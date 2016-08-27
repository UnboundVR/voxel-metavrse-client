<template>
  <div id="auth-component">
    <nav id="auth-component-menu" class="css_menu">
      <ul v-if="loggedIn">
        <li>
          <img id="auth-component-avatar" :src="avatarUrl" />
          <ul>
            <li><a href="#" @click="goToProfile">{{ name }}</a></li>
            <li><a href="#" @click="inventory">Inventory</a></li>
            <li><a href="#" @click="toggleCamera">Toggle camera</a></li>
            <li><a href="#" @click="shareLocation">Share location</a></li>
            <li><a href="#" @click="logout">Logout</a></li>
          </ul>
        </li>
      </ul>
      <ul v-else>
        <li><a href="#" @click="login">Login</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>

import service from './service';
import inventory from '../inventory';
import playerSync from '../playerSync';

export default {
  name: 'AuthComponent',
  data() {
    return {
      loggedIn: service.isLoggedIn(),
      name: service.getName(),
      avatarUrl: service.getAvatarUrl() + '&s=48'
    };
  },
  methods: {
    login: service.login,
    logout: service.logout,
    inventory: inventory.open,
    toggleCamera: playerSync.toggleCamera,
    shareLocation: playerSync.displayShareLink,
    goToProfile() {
      alert('Profile page TBC');
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

  #auth-component-avatar {
    border-radius: 25px;
  }
}

</style>

<template>
  <ui-snackbar-container
  ></ui-snackbar-container>
</template>

<script>

import { UiSnackbarContainer, UiSnackbar, UiButton } from 'keen-ui';

export default {
  components: {
    UiSnackbarContainer,
    UiSnackbar,
    UiButton
  },

  data() {
    return {};
  },

  methods: {
    createSnackbar() {
      this.$broadcast('ui-snackbar::create', {
        message: 'This is your link: sarasa',
        action: 'Copy',
        actionColor: 'primary',
        autoHide: false
      });
    }
  },

  ready() {
    window.asd = () => this.createSnackbar();
  }
};
</script>

<style lang="scss">
</style>

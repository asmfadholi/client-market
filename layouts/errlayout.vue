<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider v-if="!isMobile" v-model="collapsed" theme="dark" collapsible :style="{ position: isClient ? 'relative' : 'fixed', top: '0px', left: '0px', minHeight: '100vh'}">
      <div class="logo" />
      <a-menu theme="dark" :default-selected-keys="currentNavigation" mode="inline">
        <a-menu-item key="home">
          <nuxt-link to="/">
            <div>
              <a-icon type="desktop" />
              <span>Beranda</span>
            </div>
          </nuxt-link>
        </a-menu-item>

        <a-menu-item key="product">
          <nuxt-link to="/product">
            <div>
              <a-icon type="profile" />
              <span>Produk</span>
            </div>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="transaction">
          <nuxt-link to="/transaction">
            <div>
              <a-icon type="dollar" />
              <span>Transaksi</span>
            </div>
          </nuxt-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <div v-else>
      <a-drawer
        title="Basic Menu"
        placement="left"
        :closable="false"
        :visible="visibleDrawer"
        @close="visibleDrawer = false"
      >
        <div class="logo" />
        <a-menu theme="light" :default-selected-keys="currentNavigation" mode="inline">
          <a-menu-item key="home">
            <nuxt-link to="/">
              <div>
                <a-icon type="desktop" />
                <span>Beranda</span>
              </div>
            </nuxt-link>
          </a-menu-item>

          <a-menu-item key="product">
            <nuxt-link to="/product">
              <div>
                <a-icon type="profile" />
                <span>Produk</span>
              </div>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="transaction">
            <nuxt-link to="/transaction">
              <div>
                <a-icon type="dollar" />
                <span>Transaksi</span>
              </div>
            </nuxt-link>
          </a-menu-item>
        </a-menu>
      </a-drawer>
    </div>

    <a-layout :style="{ position: 'relative', marginLeft: isClient ? '0px' : !isMobile ? '200px' : '0px'}">
      <a-layout-header style="background: #fff; padding: 0 16px">
        <a-icon type="menu" style="font-size: 20px; cursor: pointer" @click="visibleDrawer = true" />
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <Nuxt />
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Pasar Indramayu ©2021
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import Vue from 'vue'
import browser from 'browser-detect'
// import TopNavbar from '@/components/TopNavbar'

export default Vue.extend({
  components: {
    // TopNavbar
  },
  middleware: 'user-agent',
  data () {
    return {
      visibleDrawer: false,
      isClient: false,
      show: false,
      collapsed: false
    }
  },
  computed: {
    isMobile () {
      const userAgent = this.$auth.$storage.getCookie('userAgent')
      return browser(userAgent).mobile
    },
    currentNavigation () {
      const { path = '' } = this.$route
      if (path.includes('product')) { return ['product'] }
      if (path.includes('transaction')) { return ['transaction'] }
      return ['home']
    }
  },
  watch: {
    $route () {
      this.visibleDrawer = false
    }
  },
  mounted () {
    this.isClient = true
  }
})
</script>

<style lang="scss">
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
body {
  overscroll-behavior: contain;
  min-width: 450px;
}

.ant-drawer-body {
  padding: 0px;
}
/* .ant-layout-header {
  background: #36a9e1;
}
.content-layout-default {
  padding: 0 50px;
  min-height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
}
@media screen and (max-width: 500px) {
  .content-layout-default {
    padding: 0px;
  }
  .header.ant-layout-header {
     padding: 0px 10px;
  }
} */

.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}
.slide-bottom-enter,
.slide-bottom-leave-to {
  opacity: 0;
  transform: translate3d(0, 15px, 0);
}
#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>

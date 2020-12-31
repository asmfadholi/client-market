<template>
  <div class="top-navbar-component">
    <a-row>
      <a-col :span="12">
        <nuxt-link to="/">
          <div class="logo" />
        </nuxt-link>
      </a-col>
      <a-col :span="12" style="justify-content: flex-end">
        <a-menu
          v-model="currentMenu"
          theme="light"
          mode="horizontal"
          :default-selected-keys="['1']"
          :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="1" @click="onNavigate(1)">
            <nuxt-link to="/">
              <a-icon type="home" /> Home
            </nuxt-link>
          </a-menu-item>
        </a-menu>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      visible: false,
      currentMenu: []
    }
  },
  computed: {
    userName () {
      const { email = '' } = this.$auth.$storage.getUniversal('user')
      return email
    }
  },
  watch: {
    $route () {
      this.setCurrentMenu()
    }
  },
  created () {
    this.setCurrentMenu()
  },
  methods: {
    setCurrentMenu () {
      if (this.$route.path === '/') {
        this.currentMenu = ['1']
      } else if (this.$route.path.includes('/ticket')) {
        this.currentMenu = ['2']
      } else {
        this.currentMenu = []
      }
    },
    onNavigate (val) {
      this.currentMenu = [`${val}`]
    },
    logout () {
      this.visible = false
      this.$auth.logout()
      this.$auth.$storage.removeUniversal('user')
      this.$auth.$storage.removeUniversal('redirect')
      this.$router.replace('/login')
    }
  }
})
</script>

<style lang="scss">
.top-navbar-component {

  .ant-row, .ant-col, .ant-row {
    height: 100%;
  }
  .ant-col {
    height: 64px;
    display: flex;
    align-items: center;
  }
  .ant-menu {
    float: right;
  }
  .ant-card-meta-description {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .logo {
    height: 50px;
    width: 50px;
    margin: auto 0px;
    background: #f2f2f2;
  }
  .ant-menu-item-selected {
    background: #36a9e1;
    a {
      color: #fff;
    }
  }
  .ant-menu-item {
    background: #36a9e1;
    border-color: #36a9e1;
    a {
      color: #fff;
    }
  }
}
.ant-menu-horizontal > .ant-menu-item:hover, .ant-menu-horizontal > .ant-menu-submenu:hover, .ant-menu-horizontal > .ant-menu-item-active, .ant-menu-horizontal > .ant-menu-submenu-active, .ant-menu-horizontal > .ant-menu-item-open, .ant-menu-horizontal > .ant-menu-submenu-open, .ant-menu-horizontal > .ant-menu-item-selected, .ant-menu-horizontal > .ant-menu-submenu-selected {
  border-color: #fff;
}
</style>

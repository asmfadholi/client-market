require('dotenv').config()

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  mode: 'universal',
  head: {
    title: 'vms-client',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    'ant-design-vue/dist/antd.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/antd-ui',
    '@/plugins/lazy-load',
    '@/plugins/generate-url',
    { src: '@/plugins/qr', mode: 'client' },
    { src: '@/plugins/debounce', mode: 'client' }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},
  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL
    }
  },
  server: {
    port: 8000, // default: 3000
    host: '0.0.0.0' // default: localhost
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
  auth: {
    localStorage: {
      prefix: 'auth.'
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/local', method: 'post', propertyName: 'access_token' },
          user: false,
          logout: false
        }
      }
    }
  }
}

import Vue from 'vue'
import vueDebounce from 'vue-debounce'

Vue.use(vueDebounce)

// Or if you want to pass in the lock option
Vue.use(vueDebounce, {
  listenTo: ['input', 'keyup', 'change', 'select'],
  defaultTime: '400ms'
})

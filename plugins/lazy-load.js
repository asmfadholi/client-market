import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import BlankImage from '~/assets/images/blank-trip.png'

Vue.use(VueLazyload, {
  preLoad: 1,
  error: BlankImage,
  loading: BlankImage,
  attempt: 1
})

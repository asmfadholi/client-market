<template>
  <div class="container-home">
    <a-breadcrumb style="margin: 16px 0">
      <nuxt-link to="/transaction">
        <a-breadcrumb-item>Transaksi</a-breadcrumb-item>
      </nuxt-link>
      <a-breadcrumb-item>Buat</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px', margin: '16px 0' }">
      <h1>
        <a-space size="middle">
          <a-icon type="dollar" style="font-size: 15px" />
          <span>Buat Transaksi</span>
        </a-space>
      </h1>
      <a-divider />
      <FormTransaction :model="model" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import FormTransaction from '@/components/FormTransaction'
import { detailModel } from '@/api/model'

export default Vue.extend({
  components: {
    FormTransaction
  },
  async asyncData ({ $axios, redirect }) {
    try {
      const req = {
        name: 'product'
      }
      const response = await detailModel({ axios: $axios, req })
      const [res = {}] = (response?.data || []).map(each => ({ ...each.attributes, id: each.id }))
      const { model = null } = res
      return { model: model || null }
    } catch (err) {
      redirect('/sorry')
    }
  },
  scrollToTop: true
  // transition: 'slide-bottom'
})
</script>

<style lang="scss">
.container-home {
  button {
    margin: 10px 0px;
  }
}
</style>

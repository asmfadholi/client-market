<template>
  <div class="container-home">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>
        <nuxt-link to="/product">
          <span>
            Produk
          </span>
        </nuxt-link>
      </a-breadcrumb-item>

      <a-breadcrumb-item>Tambah</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px', margin: '16px 0' }">
      <h1>
        <a-space size="small">
          <a-icon type="plus-circle" style="font-size: 15px" />
          <span>Tambah Produk</span>
        </a-space>
      </h1>

      <a-divider />
      <FormProduct :model="model" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import FormProduct from '@/components/FormProduct'
import { detailModel } from '@/api/model'

export default Vue.extend({
  components: {
    FormProduct
  },
  async asyncData ({ $axios, redirect }) {
    try {
      const req = {
        name: 'product'
      }
      const response = await detailModel({ axios: $axios, req })
      const [res = {}] = response.data
      const { model = null } = res
      return { model: model || null }
    } catch (err) {
      redirect('/sorry')
    }
  },
  scrollToTop: true,
  transition: 'slide-bottom'
})
</script>

<style lang="scss">
.container-home {
  button {
    margin: 10px 0px;
  }
}
</style>

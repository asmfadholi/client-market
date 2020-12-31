<template>
  <div class="container-home">
    <div>
      <h2>
        <a-space size="middle">
          <a-icon type="dollar" style="font-size: 20px" />
          <span>Buat Transaksi</span>
        </a-space>
      </h2>
    </div>
    <a-divider />
    <FormTransaction :model="model" />
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
      const [res = {}] = await detailModel({ axios: $axios, req })
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

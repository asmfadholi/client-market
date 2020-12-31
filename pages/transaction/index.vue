<template>
  <div class="container-product">
    <div>
      <h2>
        <a-space size="middle">
          <a-icon type="ordered-list" style="font-size: 20px" />
          <span>List Transaksi</span>
        </a-space>
      </h2>
    </div>
    <div style="display: flex; justify-content: flex-end; margin: 20px 0px">
      <nuxt-link to="/transaction/add">
        <a-button type="primary" icon="plus-circle" size="default">
          Buat transaksi
        </a-button>
      </nuxt-link>
    </div>
    <TableTransaction :data="transactions || transactionList" :loading="loading" @onDeleted="onDeleted" />
  </div>
</template>

<script>
import Vue from 'vue'
import TableTransaction from '@/components/TableTransaction'
import { getTransaction } from '@/api/transaction'

export default Vue.extend({
  components: {
    TableTransaction
  },
  async asyncData ({ $axios, redirect }) {
    try {
      const res = await getTransaction({ axios: $axios })
      return { transactionList: res || [] }
    } catch (err) {
      redirect('/sorry')
    }
  },
  scrollToTop: true,
  transition: 'slide-bottom',
  data () {
    return {
      transactions: null,
      loading: false
    }
  },
  methods: {
    // async onDeleted () {
    //   try {
    //     const res = await getProduct({ axios: this.$axios })
    //     this.products = res
    //   } catch (err) {
    //     this.$message.error('Maaf gagal perbaharui produk, silahkan refresh page')
    //   }
    // }
  }
})
</script>

<style lang="scss">
.container-home {
  button {
    margin: 10px 0px;
  }
}
</style>

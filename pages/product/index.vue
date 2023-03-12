<template>
  <div class="container-product" :style="{ padding: '24px', background: '#fff', minHeight: '360px', margin: '16px 0' }">
    <div>
      <h1>
        <a-space size="small">
          <a-icon type="ordered-list" style="font-size: 15px" />
          <span>List Produk</span>
        </a-space>
      </h1>
    </div>
    <a-divider />
    <a-row style="margin: 0px 0px 20px">
      <a-col :span="12">
        <a-input
          v-model="search"
          v-debounce="doSearch"
          placeholder="Cari Produk"
        />
      </a-col>
      <a-col :span="12">
        <div style="display: flex; justify-content: flex-end;">
          <nuxt-link to="/product/add">
            <a-button type="primary" icon="plus-circle" size="default">
              Tambah Produk
            </a-button>
          </nuxt-link>
        </div>
      </a-col>
    </a-row>

    <TableProduct ref="tableProduct" :data="products || productList" @onDeleted="onDeleted" @onEdit="onEdit" />
    <a-modal
      class="modal-style"
      :mask-closable="false"
      title="Edit Produk"
      :visible="visible"
      :footer="null"
      @cancel="onCancel"
    >
      <FormProduct :data-edit="dataEdit" @onEdited="onEdited" />
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import TableProduct from '@/components/TableProduct'
import FormProduct from '@/components/FormProduct'
import { getProduct, getProductByFilter } from '@/api/product'

export default Vue.extend({
  components: {
    TableProduct,
    FormProduct
  },
  async asyncData ({ $axios, redirect }) {
    try {
      const res = await getProduct({ axios: $axios })
      const normData = (res?.data || []).map(each => ({ ...each.attributes, id: each.id }))
      return { productList: normData }
    } catch (err) {
      redirect('/sorry')
    }
  },
  scrollToTop: true,
  transition: 'slide-bottom',
  data () {
    return {
      products: null,
      visible: false,
      search: '',
      dataEdit: null,
      loading: false
    }
  },
  methods: {
    onEdited () {
      this.onCancel()
      this.doSearch()
    },
    onCancel () {
      this.visible = false
      this.dataEdit = null
    },
    async onDeleted () {
      try {
        const res = await getProduct({ axios: this.$axios })
        const normData = (res?.data || []).map(each => ({ ...each.attributes, id: each.id }))
        this.products = normData
      } catch (err) {
        this.$message.error('Maaf gagal perbaharui produk, silahkan refresh page')
      }
    },
    onEdit (row) {
      this.dataEdit = row
      this.visible = true
    },
    async doSearch () {
      let products = []
      try {
        this.$refs.tableProduct.setLoading(true)
        const req = { 'filters[uniqueName][$containsi]': this.search }
        const res = await getProductByFilter({ axios: this.$axios, req })
        const normData = (res?.data || []).map(each => ({ ...each.attributes, id: each.id }))
        products = normData
      } catch (err) {
        this.$message.error('Maaf gagal perbaharui produk, silahkan refresh page')
      } finally {
        setTimeout(() => {
          this.products = products
          this.$refs.tableProduct.setLoading(false)
        }, 300)
      }
    }
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

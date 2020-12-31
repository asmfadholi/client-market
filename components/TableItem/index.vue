<template>
  <a-table :columns="columns" :data-source="data" row-key="id" :scroll="scroll" :loading="loading">
    <span slot="count" slot-scope="count, row">
      {{ `Rp. ${count * row.price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
    </span>
    <span
      slot="action"
      slot-scope="action, row"
      style="display: flex; justify-content: center; cursor: pointer; font-size: 20px"
    >
      <a-popconfirm placement="topLeft" ok-text="Yes" cancel-text="No" @confirm="confirm(row)">
        <template slot="title">
          <p>Apa kamu yakin ingin delete produk ini?</p>
        </template>
        <a-icon type="close-circle" style="color: red" />
      </a-popconfirm>
    </span>
  </a-table>
</template>
<script>
import { deleteProduct } from '@/api/product'

const columns = [
  {
    dataIndex: 'count',
    key: 'count',
    title: 'Jumlah',
    fixed: 'left'
  },
  {
    title: 'Nama Produk',
    dataIndex: 'productName',
    key: 'productName',
    fixed: 'left'
  },
  {
    title: 'Harga',
    dataIndex: 'count',
    scopedSlots: { customRender: 'count' },
    key: 'count'
  }
  // {
  //   title: 'Action',
  //   dataIndex: 'action',
  //   scopedSlots: { customRender: 'action' },
  //   key: 'action',
  //   fixed: 'right'
  // }
]

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: false,
      columns,
      scroll: {
        x: 100
      }
    }
  },
  methods: {
    async doDeleteProduct (val) {
      this.loading = true
      try {
        const req = {
          id: val.id
        }
        await deleteProduct({ axios: this.$axios, req })
        this.$message.success('Berhasil menghapus produk')
        await this.$emit('onDeleted')
      } catch (err) {
        this.$message.error('Maaf gagal menghapus produk, silahkan coba lagi')
      } finally {
        this.loading = false
      }
    },
    confirm (val) {
      this.doDeleteProduct(val)
    }
  }
}
</script>

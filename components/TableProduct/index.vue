<template>
  <a-table :columns="columns" :data-source="data" row-key="id" :scroll="scroll" :loading="loading">
    <span slot="image" slot-scope="image">
      <img v-lazy="checkImage(image)" width="30px" height="30px" style="border-radius: 5px; object-fit: cover">
    </span>
    <div slot="price" slot-scope="price" style="text-align: right">
      {{ `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
    </div>
    <span
      slot="action"
      slot-scope="action, row"
      style="display: flex; justify-content: center; cursor: pointer; font-size: 20px"
    >
      <a-space size="middle">
        <a @click="onEdit(row)">
          <a-icon type="form" style="color: #1890ff; font-size: 15px" />
        </a>
        <a-popconfirm placement="topLeft" ok-text="Yes" cancel-text="No" @confirm="confirm(row)">
          <template slot="title">
            <p>Apa kamu yakin ingin delete produk ini?</p>
          </template>
          <a-icon type="delete" style="color: red; font-size: 15px" />
        </a-popconfirm>
      </a-space>

    </span>
  </a-table>
</template>
<script>
import { deleteProduct } from '@/api/product'

const columns = [
  {
    dataIndex: 'id',
    key: 'id',
    title: 'ID',
    fixed: 'left'
  },
  {
    title: 'Nama Produk',
    dataIndex: 'uniqueName',
    key: 'name',
    fixed: 'left'
  },
  {
    title: 'Gambar',
    dataIndex: 'image',
    scopedSlots: { customRender: 'image' },
    key: 'image'
  },
  {
    title: 'Harga (Rp)',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' },
    key: 'price'
  },
  {
    title: 'Action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    key: 'action',
    fixed: 'right'
  }
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
        x: 600
      }
    }
  },
  methods: {
    onEdit (row) {
      this.$emit('onEdit', row)
    },
    setLoading (val) {
      this.loading = val
    },
    checkImage (img) {
      const { url = '' } = img || {}
      return this.$generateUrl(url || '')
    },
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
        setTimeout(() => {
          this.loading = false
        }, 300)
      }
    },
    confirm (val) {
      this.doDeleteProduct(val)
    }
  }
}
</script>

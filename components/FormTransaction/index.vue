<template>
  <div class="form-transaction-component">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      class="form-area-component"
    >
      <a-form-model-item ref="name" label="Nama Pelanggan" prop="name">
        <a-input
          v-model="form.name"
          placeholder="Tulis Nama"
        />
      </a-form-model-item>
      <a-form-model-item label="Cari Produk di sini">
        <div style="display: flex; justify-content: center">
          <a-space size="middle">
            <a-button
              type="danger"
              shape="circle"
              icon="minus"
              size="medium"
              :disabled="count === 1"
              @click="count--"
            />
            <span>{{ count }}</span>
            <a-button type="primary" shape="circle" icon="plus" size="medium" @click="count++" />
          </a-space>
        </div>
        <div class="add-product">
          <a-row>
            <a-col :sm="24" :md="20" style="margin-bottom: 10px">
              <a-select
                v-model="search"
                v-debounce="doSearch"
                class="select-product"
                show-search
                placeholder="Cari produk disini"
                style="width: 100%; height: 60px"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                not-found-content="Produk tidak ditemukan"
                @search="onChangeSearch"
              >
                <a-select-option v-for="d in productOptions" :key="JSON.stringify(d)">
                  <a-space size="middle">
                    <img v-lazy="checkImage(d.image)" height="50px" width="50px" style="object-fit: cover; border-radius: 5px">
                    <span>
                      {{ d.uniqueName }}
                    </span>
                  </a-space>
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :sm="24" :md="4">
              <a-button type="primary" size="medium" style="margin: 0px; width: 100%; height: 60px" @click="addProduct">
                Add
              </a-button>
            </a-col>
          </a-row>
        </div>
      </a-form-model-item>

      <div v-if="transactions.length > 0">
        <TableItem :data="transactions" />
      </div>

      <a-form-model-item>
        <a-popconfirm placement="top" ok-text="Yes" cancel-text="No" @confirm="onSubmit">
          <template slot="title">
            <p>Apa kamu yakin ingin membuat transaksi sekarang?</p>
          </template>
          <a-button type="primary" :loading="loadingForm">
            Submit
          </a-button>
        </a-popconfirm>

        <a-popconfirm placement="top" ok-text="Yes" cancel-text="No" @confirm="resetForm">
          <template slot="title">
            <p>Apa kamu yakin ingin mereset formulir?</p>
          </template>
          <a-button style="margin-left: 10px;">
            Reset
          </a-button>
        </a-popconfirm>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import Vue from 'vue'
import { getProductDetail, getProductByFilter } from '@/api/product'
import { createTransaction } from '@/api/transaction'
import TableItem from '@/components/TableItem'

export default Vue.extend({
  components: {
    TableItem
  },
  props: {
    model: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      count: 1,
      showScan: false,
      countTrain: 5,
      currentStream: '',
      label: '',
      querySearch: '',
      transactions: [],
      productOptions: [],
      currentProduct: null,
      isSetProduk: false,
      offsetVideo: 0,
      loadingScan: false,
      predict: '',
      search: '',
      capturing: false,
      visible: false,
      loadingForm: false,
      loadingInit: false,
      loadingModel: false,
      form: {
        name: null,
        count: 1
      },
      rules: {
        name: [{ required: true, message: 'Field is required', trigger: 'change' }]
      }
    }
  },
  created () {
    this.doSearch()
  },
  methods: {
    addProduct () {
      const { name = '', price = 0 } = JSON.parse(this.search) || {}
      this.transactions.push({ productName: name, price: Number(price), count: this.count, __component: 'transaction.transaction' })
      this.search = ''
      this.count = 1
    },

    onChangeSearch (val) {
      this.querySearch = val
    },

    checkImage (img) {
      const { url = '' } = img || {}
      return this.$generateUrl(url || '')
    },

    async doSearch () {
      // let products = []
      try {
        const req = { uniqueName_contains: this.querySearch, _limit: 20 }
        const res = await getProductByFilter({ axios: this.$axios, req })
        this.productOptions = res
        // products = res
      } catch (err) {
        this.$message.error('Maaf gagal perbaharui produk, silahkan refresh page')
      }
    },

    async doGetProduct (val) {
      this.loadingScan = true
      if (this.productList[val]) {
        this.currentProduct = this.productList[val]
      }
      try {
        const req = {
          name: val
        }
        const [res = null] = await getProductDetail({
          axios: this.$axios,
          req
        })
        if (!res) {
          this.$message.error('Produk tidak ditemukan')
        } else {
          this.isSetProduk = true
          this.productList[val] = res
          this.currentProduct = res
          this.form.count = 1
        }
      } catch (err) {
        this.$message.error('Gagal mencari produk, silahkan coba lagi')
      } finally {
        this.loadingScan = false
      }
    },

    openScanner () {
      this.visible = true
    },

    onCancel () {
      this.countTrain = 5
      this.visible = false
      this.loadingForm = false
    },

    checkCount () {
      const currentCount = this.countTrain - 1
      if (currentCount === 0) {
        this.saveModel()
      } else {
        this.countTrain = currentCount
      }
    },

    generateDataTransaction () {
      let totalPrice = 0
      this.transactions.forEach((item) => {
        totalPrice += (item.price * item.count)
      })
      const req = {
        name: this.form.name,
        total: totalPrice,
        transactions: this.transactions
      }
      return req
    },

    async doCreateTransaction () {
      this.loadingForm = true
      const req = this.generateDataTransaction()
      try {
        await createTransaction({
          axios: this.$axios,
          req
        })
        this.$message.success('Transaksi berhasil dibuat')
        this.$router.push('/transaction')
      } catch (err) {
        this.$message.error('gagal membuat transaksi, silahkan coba lagi')
      } finally {
        this.loadingForm = false
      }
    },

    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loadingForm = true
          if (this.transactions.length === 0) {
            this.loadingForm = false
            return this.$message.error('Tidak ada produk yang di beli, silahkan tambahkan produk')
          }
          this.doCreateTransaction()
        } else {
          return this.$message.error('Silahkan lengkapi data terlebih dahulu')
        }
      })
    },

    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
})
</script>

<style lang="scss">
.form-transaction-component {
  .add-product .ant-space {
    width: 100% !important;
    .ant-space-item:first-child {
      width: 100% !important;
    }
  }
  .add-product .select-product .ant-select-selection--single {
    height: 60px !important;
    .ant-select-selection__rendered {
      margin-top: 4px !important;
    }
  }
}
</style>

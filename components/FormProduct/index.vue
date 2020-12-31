<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    class="form-area-component"
  >
    <a-form-model-item ref="name" label="Nama Produk" prop="name">
      <a-input
        v-model="form.name"
        placeholder="Tulis Nama Produk"
      />
    </a-form-model-item>
    <a-row>
      <a-col :sm="24" :md="12">
        <a-form-model-item ref="price" label="Harga / Satuan" prop="price">
          <a-input-number
            v-model="form.price"
            style="width: 100%"
            :min="0"
            placeholder="Tulis Harga"
            :formatter="value => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace('Rp. ', '').replace(/\,/g, '')"
          />
        </a-form-model-item>
      </a-col>
      <a-col :sm="24" :md="12">
        <a-form-model-item ref="unit" label="Satuan" prop="unit">
          <a-select v-model="form.unit" style="width: 100%">
            <a-select-option v-for="(unit, idx) in unitOptions" :key="idx" :value="unit">
              {{ unit }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-row>

    <a-form-model-item ref="image" label="Foto Produk" prop="image">
      <UploadImage @uploaded="uploaded" />
    </a-form-model-item>

    <a-form-model-item>
      <a-button type="primary" :loading="loadingForm" @click="onSubmit">
        Tambahkan
      </a-button>
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
</template>

<script>
import Vue from 'vue'
import UploadImage from '@/components/UploadImage'
import { createProduct } from '@/api/product'

export default Vue.extend({
  components: {
    UploadImage
  },
  props: {
    model: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      countTrain: 5,
      currentStream: '',
      label: '',
      offsetVideo: 0,
      predict: '',
      capturing: false,
      visible: false,
      loadingForm: false,
      loadingInit: false,
      loadingModel: false,
      unitOptions: [
        'eceran',
        'pack',
        'dus'
      ],
      form: {
        name: null,
        price: null,
        image: null,
        unit: 'eceran'
      },
      rules: {
        name: [{ required: true, message: 'Field is required', trigger: 'change' }],
        price: [{ required: true, message: 'Field is required', trigger: 'change' }],
        unit: [{ required: true, message: 'Field is required', trigger: 'change' }]
        // image: [{ required: true, message: 'Field is required', trigger: 'change' }]
      }
    }
  },
  methods: {

    uploaded (val) {
      this.form.image = val
    },

    async createProduct () {
      this.loadingForm = true
      const req = this.generateDataProduct()
      try {
        await createProduct({
          axios: this.$axios,
          req
        })
        this.loadingForm = false
        this.$message.success('Berhasil menambah produk')
        this.form = {
          name: null,
          price: null,
          image: null,
          unit: 'eceran'
        }
      } catch (err) {
        this.$message.error('Gagal menambah produk, silahkan coba lagi')
      } finally {
        this.loadingForm = false
      }
    },

    generateDataProduct () {
      const formData = new FormData()
      const { image = {}, name = '', price = 0, unit = '' } = this.form
      const { originFileObj = '' } = image || {}
      const newName = `${name} - ${unit}`
      const dataBody = { name: newName, price, unit }
      if (originFileObj) {
        formData.append('files.image', originFileObj)
      }
      formData.append('data', JSON.stringify(dataBody))
      return formData
    },

    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.createProduct()
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

<style lang="scss" scoped>
.form-area-component {
  .qr-code-scan {
    text-align: center;
    padding: 30px;
    border: 1px dashed #000;
  }
}
</style>

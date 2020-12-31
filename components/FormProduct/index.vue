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
    <a-form-model-item ref="price" label="Harga / satuan" prop="price">
      <a-input-number
        v-model="form.price"
        style="width: 100%"
        :min="0"
        placeholder="Tulis Harga"
        :formatter="value => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
        :parser="value => value.replace('Rp. ', '').replace(/\,/g, '')"
      />
    </a-form-model-item>
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
    <a-modal
      class="modal-style"
      :mask-closable="false"
      title="Latih mesin untuk mengenali produk"
      :visible="visible"
      @cancel="onCancel"
    >
      <div>
        <qrcode-stream ref="videoStream" :style="{ display: capturing ? 'none': 'block' }" @init="onInit">
          <div v-if="loadingInit" style="display: flex; justify-content: center; align-items: center; height: 100%">
            <a-icon type="loading" style="font-size: 30px" />
          </div>
        </qrcode-stream>
        <div v-if="capturing" :style="{ height: `${offsetVideo}px`, width: '100%', background: '#efefef' }" />
      </div>

      <div slot="footer" style="display: flex; justify-content: center">
        <a-button size="large" :loading="loadingModel" @click="trainModel">
          Latih ({{ countTrain }})
        </a-button>
      </div>
    </a-modal>
  </a-form-model>
</template>

<script>
import Vue from 'vue'
import UploadImage from '@/components/UploadImage'
import { updateModel } from '@/api/model'
import { createProduct } from '@/api/product'
import * as tf from '@tensorflow/tfjs'
import * as knnClassifier from '@tensorflow-models/knn-classifier'
import * as mobilenetModule from '@tensorflow-models/mobilenet'

let net

const classifier = knnClassifier.create()

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
      form: {
        name: null,
        price: null,
        image: null
      },
      rules: {
        name: [{ required: true, message: 'Field is required', trigger: 'change' }],
        price: [{ required: true, message: 'Field is required', trigger: 'change' }],
        image: [{ required: true, message: 'Field is required', trigger: 'change' }]
      }
    }
  },
  async created () {
    if (process.client) {
      const mobileNet = await mobilenetModule.load()
      net = mobileNet
      if (this.model) {
        this.loadDataset()
      }
    }
  },
  methods: {
    async onInit (promise) {
      this.loadingInit = true
      await promise
      this.loadingInit = false
      this.offsetVideo = this.$refs.videoStream.$refs.video.offsetHeight
    },

    onCancel () {
      this.countTrain = 5
      this.visible = false
      this.loadingForm = false
    },

    uploaded (val) {
      this.form.image = val
    },

    async trainModel () {
      const webcamElement = this.$refs.videoStream.$refs.video
      this.capturing = true
      const webcam = await tf.data.webcam(webcamElement)
      // Capture an image from the web camera.
      const img = await webcam.capture()

      // Get the intermediate activation of MobileNet 'conv_preds' and pass that
      // to the KNN classifier.
      const activation = net.infer(img, true)

      // Pass the intermediate active
      classifier.addExample(activation, this.form.name)
      // Dispose the tensor to release the memory.
      img.dispose()
      this.checkCount()
      this.capturing = false
    },

    checkCount () {
      const currentCount = this.countTrain - 1
      if (currentCount === 0) {
        this.saveModel()
      } else {
        this.countTrain = currentCount
      }
    },

    async saveModel () {
      this.loadingModel = true
      try {
        const req = {
          id: 1,
          name: 'product',
          model: this.saveDataSet()
        }
        await updateModel({
          axios: this.$axios,
          req
        })
        this.visible = false
        this.countTrain = 5
        this.createProduct()
      } catch (err) {
        this.$message.error('gagal Update model, silahkan coba lagi')
      } finally {
        this.loadingModel = false
      }
    },

    saveDataSet () {
      const str = JSON.stringify(Object.entries(classifier.getClassifierDataset()).map(([label, data]) => [label, Array.from(data.dataSync()), data.shape]))
      // can be change to other source
      return str
    },

    loadDataset () {
      // can be change to other source
      const str = this.model
      const tensorObj = Object.fromEntries(JSON.parse(str).map(([label, data, shape]) => [label, tf.tensor(data, shape)]))
      classifier.setClassifierDataset(tensorObj)
    },

    async createProduct () {
      this.loadingForm = true
      const req = this.generateDataProduct()
      try {
        await createProduct({
          axios: this.$axios,
          req
        })
        this.$router.push('/product')
      } catch (err) {
        this.$message.error('gagal menambah produk, silahkan coba lagi')
      } finally {
        this.loadingForm = false
      }
    },

    generateDataProduct () {
      const formData = new FormData()
      const { image = {}, name = '', price = 0 } = this.form
      const dataBody = { name, price }
      formData.append('files.image', image.originFileObj || '')
      formData.append('data', JSON.stringify(dataBody))
      return formData
    },

    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loadingForm = true
          this.visible = true
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

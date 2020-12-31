<template>
  <div>
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
      <a-modal
        v-if="visible"
        class="modal-style"
        :mask-closable="false"
        title="Scan Produkmu"
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
          <a-button size="large" :loading="loadingModel" @click="predictProduct">
            Scan
          </a-button>
        </div>
        <a-modal
          v-if="isSetProduk"
          class="modal-style"
          :mask-closable="false"
          :title="currentProduct.name"
          :visible="isSetProduk"
          @cancel="isSetProduk = !isSetProduk"
        >
          <div style="text-align: center">
            <img
              v-lazy="$generateUrl(currentProduct.image.url)"
              style="height: 150px; width: 150px; object-fit: cover; border-radius: 5px; margin-top: 10px"
            >
            <h3><b>{{ currentProduct.name }}</b></h3>
            {{ `Rp. ${currentProduct.price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} / satuan
          </div>
          <div>
            <a-input-number
              v-model="form.count"
              style="width: 100%; margin-top: 20px"
              :min="1"
            />
          </div>

          <div slot="footer" style="display: flex; justify-content: center">
            <a-button size="large" :disabled="!form.count > 0" @click="addProduct">
              Tambahkan
            </a-button>
          </div>
        </a-modal>
      </a-modal>
    </a-form-model>
    <div v-if="showScan" class="navigation-bottom">
      <div class="wrapper" @click="openScanner">
        SCAN
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// import UploadImage from '@/components/UploadImage'
import { updateModel } from '@/api/model'
import { createProduct, getProductDetail } from '@/api/product'
import { createTransaction } from '@/api/transaction'
import TableItem from '@/components/TableItem'
import * as tf from '@tensorflow/tfjs'
import * as knnClassifier from '@tensorflow-models/knn-classifier'
import * as mobilenetModule from '@tensorflow-models/mobilenet'

let net

const classifier = knnClassifier.create()

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
      showScan: false,
      countTrain: 5,
      currentStream: '',
      label: '',
      transactions: [],
      productList: {},
      currentProduct: null,
      isSetProduk: false,
      offsetVideo: 0,
      loadingScan: false,
      predict: '',
      capturing: false,
      visible: false,
      loadingForm: false,
      loadingInit: false,
      loadingModel: false,
      form: {
        name: null,
        count: 1
        // price: null,
        // image: null
      },
      rules: {
        name: [{ required: true, message: 'Field is required', trigger: 'change' }]
        // price: [{ required: true, message: 'Field is required', trigger: 'change' }],
        // image: [{ required: true, message: 'Field is required', trigger: 'change' }]
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

      setTimeout(() => {
        this.showScan = true
      }, 500)
    }
  },
  methods: {
    addProduct () {
      const { name = '', price = 0 } = this.currentProduct
      this.transactions.push({ productName: name, price: Number(price), count: this.form.count, __component: 'transaction.transaction' })
      this.isSetProduk = false
    },
    async onInit (promise) {
      this.loadingInit = true
      await promise
      this.loadingInit = false
      this.offsetVideo = this.$refs.videoStream.$refs.video.offsetHeight
    },

    async predictProduct () {
      this.capturing = true
      if (classifier.getNumClasses() > 0) {
        const webcamElement = this.$refs.videoStream.$refs.video
        const webcam = await tf.data.webcam(webcamElement)
        const img = await webcam.capture()
        console.log(img)

        // Get the activation from mobilenet from the webcam.
        const activation = net.infer(img, 'conv_preds')
        // Get the most likely class and confidence from the classifier module.
        const result = await classifier.predictClass(activation)
        this.capturing = false

        if (result.confidences[result.label] > 0.8) {
          await this.doGetProduct(result.label)
        }

        // Dispose the tensor to release the memory.
        img.dispose()
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

    async loadDataset () {
      // can be change to other source
      const str = this.model
      const tensorObj = Object.fromEntries(JSON.parse(str).map(([label, data, shape]) => [label, tf.tensor(data, shape)]))
      classifier.setClassifierDataset(tensorObj)
      // const model = await classifier.getClassifierDataset()
      const model = await Object.entries(classifier.getClassifierDataset()).map(([label, data]) => [label, Array.from(data.dataSync()), data.shape])
      model.save('localstorage://my-model-1')
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
            return this.$message.error('Tidak ada produk yang di beli, silahkan scan terlebih dahulu')
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

<style lang="scss" scoped>
.navigation-bottom {
  position: fixed;
    bottom: 0px;
    left: 0px;
    background: #fff;
    z-index: 20;
    width: 100%;
    display: flex;
    justify-content: center;
    height: 56px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
    .wrapper {
      top: -45px;
      position: relative;
      height: 100px;
      background: #36a9e1;
      color: #fff;
      font-weight: bold;
      width: 100px;
      box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
      border-radius: 100px;
      text-align: center;
      align-items: center;
      display: flex;
      justify-content: center;
    }
}
</style>

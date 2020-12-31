<template>
  <a-upload-dragger
    name="file"
    :multiple="false"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <div v-if="status === 'uploading'">
      <a-icon type="loading" />
    </div>
    <div v-else-if="status === 'done'">
      <img v-lazy="image" alt="product" class="image-uploaded">
    </div>
    <div v-else>
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">
        Click or drag file to this area to upload
      </p>
    </div>
  </a-upload-dragger>
</template>
<script>
export default {
  data () {
    return {
      status: '',
      image: ''
    }
  },
  methods: {
    getBase64 (img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },

    reset () {
      this.status = ''
      this.image = ''
    },

    setImage (img) {
      this.image = img
      this.status = 'done'
    },

    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      return isJpgOrPng
    },

    handleChange (info) {
      const This = this
      const status = info.file.status || 'error'
      if (status === 'uploading') {
        this.status = 'uploading'
        return
      }

      if (status === 'done') {
        this.status = 'done'

        this.getBase64(info.file.originFileObj, (imageData) => {
          This.image = imageData
          This.$emit('uploaded', info.file)
        })
        this.$message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        this.status = ''
        This.image = ''
        This.$emit('uploaded', null)
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
}
</script>

<style lang="scss">
  .ant-upload {
    height: 172px !important;
  }
  .image-uploaded {
    width: 100%;
    height: 140px !important;
    object-fit: contain;
  }
</style>

<template>
  <div class="container-home">
    <div>
      <h2>
        <a-space size="middle">
          <a-icon type="profile" style="font-size: 20px" />
          <span>Inventaris Produk</span>
        </a-space>
      </h2>
      <nuxt-link to="/product/add">
        <a-button type="primary" icon="plus-circle" size="large">
          Tambah Produk
        </a-button>
      </nuxt-link>
      <nuxt-link to="/product">
        <a-button type="primary" icon="ordered-list" size="large">
          List Produk
        </a-button>
      </nuxt-link>
    </div>
    <a-divider />
    <div>
      <h2>
        <a-space size="middle">
          <a-icon type="dollar" style="font-size: 20px" />
          <span>Transaksi</span>
        </a-space>
      </h2>
      <nuxt-link to="/transaction/add">
        <a-button type="primary" icon="plus-circle" size="large">
          Buat Transaksi
        </a-button>
      </nuxt-link>

      <nuxt-link to="/transaction">
        <a-button type="primary" icon="ordered-list" size="large">
          List Transaksi
        </a-button>
      </nuxt-link>
    </div>
    <a-divider />
  </div>
</template>

<script>
import Vue from 'vue'
// import * as knnClassifier from '@tensorflow-models/knn-classifier'
// const fs = require('graceful-fs').promises
// const Tensorset = require('tensorset')

export default Vue.extend({
  scrollToTop: true,
  transition: 'slide-bottom'
  // async created () {
  //   const originalClassifier = knnClassifier.create()
  //   // originalClassifier.addExample('', 'bis')

  //   // Stringify the dataset
  //   let dataset = Tensorset.stringify(originalClassifier.getClassifierDataset())

  //   // Save the dataset
  //   await fs.writeFile('./test.json', dataset)

  //   // Load the dataset
  //   dataset = await fs.readFile('./test.json')

  //   // Parse the dataset
  //   dataset = await Tensorset.parse(dataset)

  //   // Add to a new classifier
  //   const newClassifier = knnClassifier.create()
  //   newClassifier.setClassifierDataset(dataset)
  // }
})
</script>

<style lang="scss">
.container-home {
  button {
    margin: 10px 0px;
  }
}
</style>

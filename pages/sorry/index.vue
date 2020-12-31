<template>
  <div class="container">
    <div>
      <img
        v-lazy="spiderLogo"
        class="coming"
        alt="Empty List"
      >

      <h3 class="text-center">
        Oops, halaman sedang ada perbaikan.
      </h3>
      <a-button
        variant="secondary"
        class="see-all"
        @click="$router.replace('/')"
      >
        Kembali ke Home
      </a-button>
    </div>
  </div>
</template>

<script>
import spiderLogo from '@/assets/images/spider-logo.png'

export default {
  data () {
    return {
      spiderLogo
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -20px;
  text-align: center;
  img {
    margin-bottom: 20px;
    height: 150px;
    width: 150px;
    object-fit: cover;
  }
}
</style>

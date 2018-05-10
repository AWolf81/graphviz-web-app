<template lang="html">
  <footer>
    Version {{version}} - &copy;{{year}} A. Wolf</footer>
</template>

<script>
export default {
  data () {
    // console.log('footer', process.env)
    return {
      version: process.env.version,
      year: (new Date()).getUTCFullYear()
    }
  }
}
</script>

<style lang="css">
  footer {
    padding-top: 0.5em;
    padding-right: 0.5em;
  }
</style>

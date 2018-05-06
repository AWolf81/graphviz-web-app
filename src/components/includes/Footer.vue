<template lang="html">
  <footer>
    Version {{version}} -
    This app is very alpha and may change completely at any time. If you're having important graphs keep a copy of your definition in a save place.
  </footer>
</template>

<script>
export default {
  data () {
    // console.log('footer', process.env)
    return {
      version: process.env.version
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

<template lang="html">
  <footer>
    This app is very alpha and may change completely at any time. If you're having important graphs keep a copy of your definition in a save place.
    <pre>{{env}}</pre>
  </footer>
</template>

<script>
export default {
  data () {
    return {
      env: process.env
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

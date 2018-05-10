<template lang="html">
  <div>
    <!-- app navigation bar here -->
    <navbar></navbar>

    <div class="container-fluid">
      <div class="row">
        <router-view class="col-sm-12"></router-view>
      </div>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import navbar from '@/components/includes/Navbar'
import appFooter from '@/components/includes/Footer'

export default {
  components: {
    appFooter,
    navbar
  }
}
</script>

<style lang="css">
</style>

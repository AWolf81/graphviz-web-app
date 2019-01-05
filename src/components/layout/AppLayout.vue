<template lang="html">
  <div>
    <!-- app navigation bar here -->
    <navbar></navbar>

    <router-view></router-view>
    <app-footer></app-footer>
  </div>
</template>

<script>
import navbar from "@/components/includes/Navbar";
import appFooter from "@/components/includes/Footer";

export default {
  components: {
    appFooter,
    navbar
  }
};
</script>

<style lang="css"></style>

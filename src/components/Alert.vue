<template lang="html">
  <div class="alert alert-dismissable" :class="alertType" v-if="!dismissed">
    <a
      href="#"
      class="close"
      data-dismiss="alert"
      @click="dismissed = true"
      aria-label="close"
      >&times;</a
    >
    <slot></slot>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  props: {
    id: String,
    alertType: {
      type: String,
      default: "alert-info"
    }
    // autoRemember: true
  },
  data() {
    return {
      dismissed: false
    };
  },
  watch: {
    dismissed() {
      Vue.ls.set("alert-" + this.id, this.dismissed);
    }
  },
  mounted() {
    this.dismissed = !!Vue.ls.get("alert-" + this.id);
  }
};
</script>

<style lang="css">
.cookie-info-alert {
  background-color: #f8f8f8;
}
</style>

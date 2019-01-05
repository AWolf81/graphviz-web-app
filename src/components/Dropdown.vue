<template lang="html">
  <component
    :is="tag"
    @click.prevent="toggle"
    :class="{ dropdown: dir == 'down', dropup: dir === 'up', open: visible }"
    v-on-clickaway="hideDropdown"
  >
    <component :is="triggerTag" href="#" :aria-expanded="visible"
      ><slot name="trigger"></slot>
      <!-- class="dropdown-toggle" -->
    </component>
    <!-- <slot name="trigger" @click="toggle"></slot> -->
    <transition
      :duration="duration"
      v-on:enter="showDropdown"
      v-on:after-leave="hideDropdown"
      :enter-active-class="applyClass(inClass)"
      :leave-active-class="applyClass(outClass)"
    >
      <slot v-if="visible"></slot>
    </transition>
  </component>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";
export default {
  data() {
    return {
      visible: false
    };
  },
  mixins: [clickaway],
  props: {
    dir: {
      type: String,
      default: "down"
    },
    animationClass: {
      type: String,
      default: "animated"
    },
    duration: {
      type: [Number, Object],
      default: 250
    },
    inClass: {
      type: String,
      default: "zoomIn"
    },
    outClass: {
      type: String,
      default: "zoomOut"
    },
    tag: {
      type: String,
      default: "li"
    },
    triggerTag: {
      type: String,
      default: "a"
    }
  },
  methods: {
    applyClass(className) {
      return `${this.animationClass} ${className}`;
    },
    toggle() {
      this.visible = !this.visible;
    },
    showDropdown() {
      this.visible = true;
      this.$emit("show");
    },
    hideDropdown() {
      this.visible = false;
      this.$emit("hide");
    }
  }
};
</script>

<style lang="css">
@import "~animate.css/animate.css";
</style>

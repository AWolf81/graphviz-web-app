<template lang="html">
  <component :is="tag" class="dropdown" :class="{open: isOpen}" v-on-clickaway="() => visible=false">
      <component
        :is="triggerTag"
        href="#"
        @click="toggle" :aria-expanded="visible"><slot name="trigger"></slot>
        <!-- class="dropdown-toggle" -->
      </component>
    <!-- <slot name="trigger" @click="toggle"></slot> -->
    <transition
      :duration="duration"
      v-on:enter="showDropdown"
      v-on:after-leave="hideDropdown"
      :enter-active-class="applyClass(inClass)"
      :leave-active-class="applyClass(outClass)">
      <slot v-if="visible"></slot>
    </transition>
  </component>
</template>

<script>
import {mixin as clickaway} from 'vue-clickaway'
export default {
  data () {
    return {
      visible: false,
      isOpen: false
    }
  },
  mixins: [clickaway],
  props: {
    animationClass: {
      type: String,
      default: 'animated'
    },
    duration: {
      type: [Number, Object],
      default: 250
    },
    inClass: {
      type: String,
      default: 'zoomIn'
    },
    outClass: {
      type: String,
      default: 'zoomOut'
    },
    tag: {
      type: String,
      default: 'li'
    },
    triggerTag: {
      type: String,
      default: 'a'
    }
  },
  methods: {
    applyClass (className) {
      // console.log('apply', `${this.animationClass} ${className}`)
      return `${this.animationClass} ${className}`
    },
    toggle () {
      console.log('toggle dropdown')
      this.visible = !this.visible
    },
    showDropdown () {
      this.isOpen = true
      this.$emit('show')
    },
    hideDropdown () {
      this.isOpen = false
      this.$emit('hide')
    }
  }
}
</script>

<style lang="css">
  @import "~animate.css/animate.css";
</style>

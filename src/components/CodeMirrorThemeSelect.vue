<template lang="html">
  <dropdown @show="triggerNanoscroller">
    <span slot="trigger">Select theme ({{editorTheme}})
      <span class="caret"></span>
    </span>
    <div class="dropdown-menu">
      <div class="nano">
        <div class="nano-content">
          <div class="list-group">
            <a href="#"
              class="list-group-item" :class="{active: theme === editorTheme}"
              v-for="theme in themes"
              @click="applyTheme(theme)">
                {{theme}}
            </a>
          </div>
        </div>
      </div>
    </div>
  </dropdown>
</template>

<script>
import $ from 'jquery'
import 'nanoscroller'
import {mapState} from 'vuex'
import dropdown from '@/components/Dropdown'

export default {
  components: {
    dropdown
  },
  data () {
    return {
      themes: [
        'default',
        '3024-day',
        '3024-night',
        'abcdef',
        'ambiance',
        'base16-dark',
        'base16-light',
        'bespin',
        'blackboard',
        'cobalt',
        'colorforth',
        'dracula',
        'duotone-dark',
        'duotone-light',
        'eclipse',
        'elegant',
        'erlang-dark',
        'hopscotch',
        'icecoder',
        'isotope',
        'lesser-dark',
        'liquibyte',
        'material',
        'mbo',
        'mdn-like',
        'midnight',
        'monokai',
        'neat',
        'neo',
        'night',
        'panda-syntax',
        'paraiso-dark',
        'paraiso-light',
        'pastel-on-dark',
        'railscasts',
        'rubyblue',
        'seti',
        'solarized dark',
        'solarized light',
        'the-matrix',
        'tomorrow-night-bright',
        'tomorrow-night-eighties',
        'ttcn',
        'twilight',
        'vibrant-ink',
        'xq-dark',
        'xq-light',
        'yeti',
        'zenburn'
      ]
    }
  },
  computed: mapState(['editorTheme']),
  created () {
    this.applyTheme(this.editorTheme)
  },
  mounted () {
  },
  methods: {
    applyTheme (selected) {
      console.log('apply theme', selected)
      this.$store.commit('applyEditorTheme', selected)
      // this.$emit('applytheme', selected)
    },
    triggerNanoscroller () {
      setTimeout(() =>
        $('.nano').nanoScroller({ flash: true })
      , 50)
    }
  }
}
</script>

<style lang="css" scoped>
  .form-control {
    display: inline-block;
    width: auto;
  }
</style>

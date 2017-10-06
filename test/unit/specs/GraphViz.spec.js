import Vue from 'vue'
import GraphViz from '@/components/GraphViz'

describe('GraphViz.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(GraphViz)
    const vm = new Constructor().$mount()
    console.log(vm)
    // expect(vm.$el.querySelector('.hello h1').textContent)
    //  .to.equal('Welcome to Your Vue.js App')
  })
})

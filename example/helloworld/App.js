import { h } from '../../lib/roger-mini-vue.esm.js'

window.self = null
export const App = {
  // 先使用render函数处理
  render() {
    window.self = this // 测试this使用，在浏览器的控制台
    // ui
    return h('div', { 
      id: 'root',
      class: ['red', 'hard']
    },
    // setupState
    // this.$el ---> get root element 即这个组件的根节点
    'hi,' + this.msg
    // string 
    // 'hi, mini-vue'
    // array
    // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'mini-vue')]
    )
  },
  setup() {
    // composition api
    return {
      msg: 'mini-vue-aap'
    }
  }
}
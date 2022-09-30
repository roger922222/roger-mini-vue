import { h } from '../../lib/roger-mini-vue.esm.js'

export const App = {
  // 先使用render函数处理
  render() {
    // ui
    return h('div', { 
      id: 'root',
      class: ['red', 'hard']
    },
    // 'hi,' + this.msg
    // string 
    // 'hi, mini-vue'
    // array
    [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'mini-vue')]
    )
  },
  setup() {
    // composition api
    return {
      msg: 'mini-vue'
    }
  }
}
import { h } from '../../lib/roger-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  // 先使用render函数处理
  render() {
    // emit
    return h('div', {}, [h('div', {}, 'App'), h(Foo, {
      // on + Event
      onAdd(a, b) {
        console.log('onAdd', a, b)
      },
      // add-foo ---> addFoo
      onAddFoo() {
        console.log('onAddFoo')
      }
    })])
  },
  setup() {
    // composition api
    return {}
  }
}
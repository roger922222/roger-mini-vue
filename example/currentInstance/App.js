import { h, getCurrentInstance } from '../../lib/roger-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  // 先使用render函数处理
  render() {
    return h('div', {}, [h('p', {}, 'currentInstance demo'), h(Foo)])
  },
  setup() {
    // composition api
    const instance = getCurrentInstance()
    console.log('App:', instance)
    return {}
  }
}
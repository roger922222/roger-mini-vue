import { h } from '../../lib/roger-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  // 先使用render函数处理
  render() {
    const app = h('div', {}, 'App')
    // 一个虚拟节点
    // const foo = h(Foo, {}, h('p', {}, '123'))
    // 数组的形式
    // const foo = h(Foo, {}, [h('p', {}, '123'), h('p', {}, '456')])
    // 具名插槽 object key
    const foo = h(Foo, {}, { 
      header: ({ age }) => h('p', {}, 'header' + age), 
      footer: () => h('p', {}, 'footer') 
    })
    return h('div', {}, [app, foo])
  },
  setup() {
    // composition api
    return {}
  }
}
import { h, renderSlots } from "../../lib/roger-mini-vue.esm.js"

export const Foo = {
  setup() {
    return {}
  },

  render() {
    const foo = h('p', {}, 'foo')

    // 就是为了获取到Foo组件 .vnode 虚拟节点  的 一个 children  可以通过this.$slots  获取到  组件的 children
    console.log(this.$slots)
    // children ---> vnode 才可以渲染

    // renderSlots
    // 具名插槽
    // 1. 获取到要渲染的元素 2. 获取到要渲染的位置

    // 作用域插槽
    return h("div", {}, [renderSlots(this.$slots, 'header', { age: 18 }), foo, renderSlots(this.$slots, 'footer')])
  }
}
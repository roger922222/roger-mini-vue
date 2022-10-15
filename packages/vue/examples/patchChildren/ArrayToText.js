import { h, ref } from '../../dist/roger-mini-vue.esm.js'

const nextChildren = 'newChildren'
const prevChildren = [h('div', {}, 'A'), h('div', {}, 'B')]

// 老的 array 新的 Text
export default {
  name: 'ArrayToText',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange

    return {
      isChange
    }
  },

  render() {
    const self = this

    return self.isChange ? h('div', {}, nextChildren) : h('div', {}, prevChildren)
  }
}
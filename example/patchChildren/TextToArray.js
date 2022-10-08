import { h, ref } from '../../lib/roger-mini-vue.esm.js'

const nextChildren = [h('div', {}, 'A'), h('div', {}, 'B')]
const prevChildren = 'oldChildren'

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
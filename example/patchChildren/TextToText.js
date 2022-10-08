import { h, ref } from '../../lib/roger-mini-vue.esm.js'

const nextChildren = 'newChildren'
const prevChildren = 'oldChildren'

// 老的 array 新的 Text
export default {
  name: 'TextToText',
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
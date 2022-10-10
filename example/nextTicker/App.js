import { h, ref, getCurrentInstance, nextTick } from '../../lib/roger-mini-vue.esm.js'

export default {
  name: 'App',
  setup() {
    const count = ref(1)
    const instance = getCurrentInstance()

    function onClick () {
      for (let i = 0; i < 100; i++) {
        console.log('update')
        count.value = i
      }

      // 此时的视图没有更新，数据已经更新了，需要拿到最新的视图数据就结合nextTick一起使用
      console.log(instance, 'instance')

      // 1.
      nextTick(() => {
        console.log(instance, 'instance')
      })

      // 2.
      // await nextTick()
      // console.log(instance, 'instance')
    }

    return {
      onClick,
      count
    }
  },
  render() {
    const button = h('button', { onClick: this.onClick }, 'update')
    const p = h('p', {}, 'count:' + this.count)

    return h('div', {}, [button, p])
  }
}
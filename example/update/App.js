import { h, ref } from '../../lib/roger-mini-vue.esm.js'

export const App = {
  name: 'App',
  
  setup () {
    const count = ref(0)

    const onClick = () => {
      count.value++  // 设置响应式对象的值，set操作，触发依赖
      console.log('count', count.value)
    }

    return {
      count,
      onClick
    }
  },

  render() {
    return h(
      'div',
      {
        id: 'root'
      },
      [
        h('div', {}, 'count:' + this.count), // 获取响应式对象的值，get操作，收集依赖
        h(
          'button',
          {
            onClick: this.onClick,
          },
          'click'
        )
      ]
    )
  }
}
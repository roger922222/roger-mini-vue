import { h, ref } from '../../dist/roger-mini-vue.esm.js'

export const App = {
  name: 'App',
  
  setup () {
    const count = ref(0)

    const onClick = () => {
      count.value++  // 设置响应式对象的值，set操作，触发依赖
      console.log('count', count.value)
    }

    const props = ref({
      foo: 'foo',
      bar: 'bar'
    })

    const onChangePropsDemo1 = () => {
      props.value.foo = 'new-foo'
    }

    const onChangePropsDemo2 = () => {
      props.value.foo = undefined
    }

    const onChangePropsDemo3 = () => {
      props.value = {
        foo: 'foo'
      }
    }

    const onChangePropsDemo4 = () => {
      props.value = {
        foo: 'foo',
        bar: 'bar'
      }
    }

    return {
      count,
      onClick,
      props,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3
    }
  },

  render() {
    return h(
      'div',
      {
        id: 'root',
        ...this.props
      },
      [
        h('div', {}, 'count:' + this.count), // 获取响应式对象的值，get操作，收集依赖
        h(
          'button',
          {
            onClick: this.onClick,
          },
          'click'
        ),
         h(
          'button',
          {
            onClick: this.onChangePropsDemo1,
          },
          'changeProps - 值改变了 - 修改'
        ),
         h(
          'button',
          {
            onClick: this.onChangePropsDemo2,
          },
          'changeProps - 值变成了undefined - 删除'
        ),
         h(
          'button',
          {
            onClick: this.onChangePropsDemo3,
          },
          'changeProps - key在新的里面没有了 - 删除'
        ),
        h(
          'button',
          {
            onClick: this.onChangePropsDemo4,
          },
          'changeProps - 不做任何的变化'
        )
      ]
    )
  }
}
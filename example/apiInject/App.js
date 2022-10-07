// 组件 provide 和 inject 功能
import { h, provide, inject } from '../../lib/roger-mini-vue.esm.js'

const Provider = {
  name: 'Provider',
  setup() {
    provide('foo', 'fooVal')
    provide('bar', 'barVal')
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider'), h(ProviderTwo)])
  }
}

const ProviderTwo = {
  name: 'ProviderTwo',
  setup() {
    provide('foo', 'fooTwo')
    const foo = inject('foo')
    return {
      foo
    }
  },
  render() {
    return h('div', {}, [h('p', {}, `ProviderTwo: ${this.foo}`), h(ProviderThree)])
  }
}

const ProviderThree = {
  name: 'ProviderThree',
  setup() {
    provide('foo', 'fooThree')
    const foo = inject('foo')
    return {
      foo
    }
  },
  render() {
    return h('div', {}, [h('p', {}, `ProviderThree: ${this.foo}`), h(ProviderFour)])
  }
}

const ProviderFour = {
  name: 'ProviderFour',
  setup() {
    provide('foo', 'fooFour')
    const foo = inject('foo')
    return {
      foo
    }
  },
  render() {
    return h('div', {}, [h('p', {}, `ProviderFour: ${this.foo}`), h(Consumer)])
  }
}

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo')
    const bar = inject('bar')
    // const baz = inject('baz', 'bazDefault')
    const baz = inject('baz', () => 'bazDefault')

    return {
      foo,
      bar,
      baz
    }
  },
  render() {
    return h('div', {}, `Consumer: - ${this.foo} - ${this.bar} - ${this.baz}`)
  }
}

export default {
  name: 'App',
  setup() {
    provide('foo', 'fooApp')
  },
  render() {
    return h('div', {}, [h('p', {}, 'apiInject'), h(Provider)])
  },
} 
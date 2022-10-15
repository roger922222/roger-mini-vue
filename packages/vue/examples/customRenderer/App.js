import { h } from "../../dist/roger-mini-vue.esm.js"
import { Foo } from './Foo.js'

export const App = {
  setup() {
    return {
      x: 100,
      y: 100
    }
  },
  render() {
    return h('container', { x: this.x, y: this.y }, [h(Foo)])
  }
}
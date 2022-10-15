import { h } from "../../dist/roger-mini-vue.esm.js"

export const Foo = {
  setup() {
    return {
      x: 100,
      y: 100
    }
  },
  render() {
    return h('rect', { x: this.x, y: this.y })
  }
}
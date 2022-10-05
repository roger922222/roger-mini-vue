import { h } from "../../lib/roger-mini-vue.esm.js"

export const Foo = {
  setup(props) {
    // props count readonly
    console.log(props)
    console.log(props.a.b++)
    console.log(props.count++)
  },

  render() {
    return h("div", {}, "foo:" + this.count)
  }
}
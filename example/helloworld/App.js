export const App = {
  // 先使用render函数处理
  render() {
    // ui
    return h('div', 'hi,' + this.msg)
  },
  setup() {
    // composition api
    return {
      msg: 'mini-vue'
    }
  }
}
import { h } from '../../lib/roger-mini-vue.esm.js'

import ArrayToText from './ArrayToText.js'
import TextToText from './TextToText.js'
import TextToArray from './TextToArray.js'
import ArrayToArray from './ArrayToArray.js'

export const App = {
  name: 'App',
  
  setup () {},

  render() {
    return h('div', { tId: 1 }, [
      h('p', {}, '主页'),
      //1. 老的是array 新的是text
      // h(ArrayToText),
      //2. 老的text 新的text
      // h(TextToText)
      //3. 老的是text 新的是数组array
      // h(TextToArray)
      //4. 老的array 新的array
      h(ArrayToArray)
    ]) 
  }
}
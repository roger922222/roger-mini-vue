// mini-vue的出口
export * from '@roger-mini-vue/runtime-dom'
import { baseCompiler } from '@roger-mini-vue/compiler-core'
import * as runtimeDom from '@roger-mini-vue/runtime-dom'
import { registerRuntimeCompiler } from '@roger-mini-vue/runtime-dom'

function compilerToFunction (template) {
  const { code } = baseCompiler(template)
  const render = new Function('Vue', code)(runtimeDom)
  return render
}

registerRuntimeCompiler(compilerToFunction)
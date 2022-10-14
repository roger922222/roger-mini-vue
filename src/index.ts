// mini-vue的出口
export * from './runtime-dom/index'
import { baseCompiler } from './compiler-core/src/index'
import * as runtimeDom from './runtime-dom/index'
import { registerRuntimeCompiler } from './runtime-dom/index'

function compilerToFunction (template) {
  const { code } = baseCompiler(template)
  const render = new Function('Vue', code)(runtimeDom)
  return render
}

registerRuntimeCompiler(compilerToFunction)
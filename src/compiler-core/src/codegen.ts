import { NodeTypes } from "./ast"
import { helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers"

export function generate(ast) {

  const context = createCodegenContext()

  const { push } = context

  // const VueBinging = 'vue'
  // const aliasHelper = s => `${s} as _${s}`

  // push(`import { ${ast.helpers.map(aliasHelper).join(', ')} } from "${VueBinging}"`)


  // push('\n')
  // // let code = ''
  // // code += 'export '
  // push('export ')

  genFunctionPreamble(ast, context)

  const functionName = 'render'
  const args = ['_ctx', '_cache', '$props', '$setup', '$data', '$options']
  const signature = args.join(', ')
  // code += `function ${functionName}(${signature}){`
  // code += 'return '
  push(`function ${functionName}(${signature}){`)
  push('return ')
  genNode(ast.codegenNode, context)
  // code += `return '${node.content}'` 
  // const node = ast.codegenNode
  // code += '}'
  push('}')
 
  return {
    code: context.code
  }
  
}

function genNode(node, context) {
  switch(node.type) {
    case NodeTypes.TEXT:
      genText(node, context)
      break
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break
    case NodeTypes.SIMPLE_INTERPOLATION:
      genExpression(node, context)
      break
    default:
      break
  }
}

function genText(node, context) {
  const { push } = context
  push(`'${node.content}'`)
}

function genInterpolation(node, context) {
  const { push, helper } = context
  push(`${helper(TO_DISPLAY_STRING)}(`)
  genNode(node.content, context)
  push(')')
}

function genExpression(node, context) {
  const { push } = context
  push(`${node.content}`)
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source) {
      context.code += source
    },
    helper(key) {
      return `_${helperMapName[key]}`
    }
  }
  return context
}

function genFunctionPreamble(ast, context) {
  const { push } = context

  const VueBinging = 'vue'
  const aliasHelper = s => `${helperMapName[s]} as _${helperMapName[s]}`

  if (ast.helpers.length > 0) {
    push(`import { ${ast.helpers.map(aliasHelper).join(', ')} } from "${VueBinging}"`) 
  }

  push('\n')
  // let code = ''
  // code += 'export '
  push('export ')
}
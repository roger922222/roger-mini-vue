export function generate(ast) {

  const context = createCodegenContext()

  const { push } = context

  // let code = ''
  // code += 'export '
  push('export ')
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
  const { push } = context
  push(`'${node.content}'`)
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source) {
      context.code += source
    }
  }
  return context
}
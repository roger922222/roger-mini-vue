import { NodeTypes } from "./ast"

const enum TagType {
  START,
  END
}

export function baseParse(content: string) {

  const context = createParseContext(content)

  return createRoot(parseChildren(context))
}

function parseInterpolation(context) {

  // 接受的 {{message}}

  const openDelimiter = '{{'
  const closeDelimiter = '}}'

  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)

  // context.source = context.source.slice(openDelimiter.length)
  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length

  const rawContent = context.source.slice(0, rawContentLength)
  const content = rawContent.trim()
 
  // context.source = context.source.slice(rawContentLength + closeDelimiter.length)
  advanceBy(context, rawContentLength + closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_INTERPOLATION,
      content: content
    }
  }
}

function parseElement(context) {
 // 1. 解析出来div tag
  const element = parseTag(context, TagType.START)
  parseTag(context, TagType.END)
 return element
}

function parseTag(context, type) {
  // 1. 解析出来div tag
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  console.log(match)
  const tag = match[1]
  // 2. 删除处理完成的代码
  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if (type === TagType.END) return

  return {
    type: NodeTypes.ELEMENT,
    tag
  }
}

function parseChildren(context) {
  const nodes: any = [], s = context.source
  let node
  if (s.startsWith('{{')) {
    node = parseInterpolation(context)
  } else if (s[0] === '<') {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context)
    }
  }
  nodes.push(node)
  return nodes
}

function createRoot(children) {
  return {
    children
  }
}

function createParseContext(content: string) {
  return {
    source: content
  }
}

function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length)
}
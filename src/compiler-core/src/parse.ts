import { NodeTypes } from "./ast"

const enum TagType {
  START,
  END
}

export function baseParse(content: string) {

  const context = createParseContext(content)

  return createRoot(parseChildren(context, []))
}

function parseInterpolation(context) {

  // 接受的 {{message}}

  const openDelimiter = '{{'
  const closeDelimiter = '}}'

  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)

  // context.source = context.source.slice(openDelimiter.length)
  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length

  const rawContent = parseTextData(context, rawContentLength)
  const content = rawContent.trim()
 
  // context.source = context.source.slice(rawContentLength + closeDelimiter.length)
  advanceBy(context, closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_INTERPOLATION,
      content: content
    }
  }
}

function parseElement(context, ancestors) {
 // 1. 解析出来div tag
  const element: any = parseTag(context, TagType.START)
  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()

  if (startsWithEndTagOpen(context.source,element.tag)) {
    parseTag(context, TagType.END)
  } else {
    throw new Error(`缺少结束标签：${element.tag}`)
  }
 return element
}

function startsWithEndTagOpen(source, tag) {
  return source.startsWith('</') && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
}

function parseTag(context, type) {
  // 1. 解析出来div tag
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
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

function parseTextData(context, length) {
  const content = context.source.slice(0, length)

  advanceBy(context, length)

  return content

}

function parseText(context) {
  let endIndex = context.source.length, endTokens = ['<', '{{']

  for (let i = 0; i < endTokens.length; i++) {
    let index = context.source.indexOf(endTokens[i])
    if (index !== -1 && endIndex > index) {
      endIndex = index
    }
  }

  // 1. 获取当前的内容content
  const content = parseTextData(context, endIndex)

  return {
    type: NodeTypes.TEXT,
    content
  }
}

function parseChildren(context, ancestors) {
  const nodes: any = []

  while (!isEnd(context, ancestors)) {
    let node, s = context.source
    if (s.startsWith('{{')) {
      node = parseInterpolation(context)
    } else if (s[0] === '<') {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors)
      }
    }

    if (!node) {
      node = parseText(context)
    }

    nodes.push(node)
  }
  return nodes
}

function isEnd(context, ancestors) {
  // 1. source有值的时候
  // 2. 当遇到结束标签的时 候
  const s = context.source

  if (s.startsWith('</')) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i].tag
      if (startsWithEndTagOpen(s, tag)) {
        return true
      }
    }
  }

  // if (parentTag && s.startsWith(`</${parentTag}>`)) {
  //   return true
  // }
  return !s
}

function createRoot(children) {
  return {
    children,
    type: NodeTypes.ROOT
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
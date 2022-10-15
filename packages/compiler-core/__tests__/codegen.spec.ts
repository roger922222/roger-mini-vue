import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"
import { transformElement } from "../src/transforms/transformElement"
import { transformExpression } from "../src/transforms/transformExpression"
import { transformText } from "../src/transforms/transformText"

describe('codegen', () => {
  it('string', () => {
    const ast = baseParse('hi')
    transform(ast)
    const { code } = generate(ast)

    // 快照测试 给当前的code，拍照，后续进行对比
    // 1. 抓bug
    // 2. 主动的更新快照
    expect(code).toMatchSnapshot()
  })

  it('interpolation', () => {
    const ast = baseParse('{{message}}')
    transform(ast, {
      nodeTransforms: [transformExpression]
    })
    const { code } = generate(ast)

    // 快照测试 给当前的code，拍照，后续进行对比
    // 1. 抓bug
    // 2. 主动的更新快照
    expect(code).toMatchSnapshot()
  })

  it('element', () => {
    const ast = baseParse('<div></div>')
    transform(ast, {
      nodeTransforms: [transformElement]
    })
    const { code } = generate(ast)

    // 快照测试 给当前的code，拍照，后续进行对比
    // 1. 抓bug
    // 2. 主动的更新快照
    expect(code).toMatchSnapshot()
  })

  it('element-string-interpolation', () => {
    const ast = baseParse('<div>hi,{{message}}</div>')
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText]
    })

    const { code } = generate(ast)

    // 快照测试 给当前的code，拍照，后续进行对比
    // 1. 抓bug
    // 2. 主动的更新快照
    expect(code).toMatchSnapshot()
  })
})
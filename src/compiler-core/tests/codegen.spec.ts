import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"

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
})
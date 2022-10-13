import { CREATE_ELEMENT_BLOCK } from "./runtimeHelpers"

export const enum NodeTypes {
  INTERPOLATION,
  SIMPLE_INTERPOLATION,
  ELEMENT,
  TEXT,
  ROOT,
  COMPOUND_EXPRESSION,
}

export function createVNodeCall(context, tag, props, children) {
  context.helper(CREATE_ELEMENT_BLOCK)
  return {
    type: NodeTypes.ELEMENT,
    tag,
    props,
    children
  }
}
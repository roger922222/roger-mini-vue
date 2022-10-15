import { ShapeFlags } from "@roger-mini-vue/shared"

export function initSlots(instance, children) {
  // 简单的只针对一个虚拟节点的标签
  // instance.slots = children

  // 如果是数组 或者  一个虚拟节点呢
  // instance.slots = Array.isArray(children) ? children : [children]

  // 如果是一个object

  const { shapeFlags } = instance.vnode
  if (shapeFlags & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }

  // const slots = {}
  // for (const key in children) {
  //   slots[key] = normalizeSlotValue(children[key])
  // }

  // instance.slots = slots
}

function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key]
    slots[key] = (props) => normalizeSlotValue(value(props))
  }
}

function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value]
}
import { createVNode } from "./vnode"

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // 1. 先转换为虚拟节点 vnode   component (组件)  ---> vnode (虚拟节点)
        // 2. 所有的逻辑操作都会基于vnode做处理

        const vnode = createVNode(rootComponent)

        render(vnode, rootContainer)
      }
    }
  } 
}
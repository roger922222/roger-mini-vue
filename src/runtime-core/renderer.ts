
import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode"

export function render(vnode, container) {

  // TODO 判读vnode 是不是一个element  是 就走element 逻辑 如何区分是element 还是 component

  // patch 后面的递归处理
  patch(vnode, container)
}

function patch(vnode, container) {
  // shapeFlags
  // vnode  ---> flag

  // 增加一个Fragment  只渲染children

  const { shapeFlags, type } = vnode


  switch(type) {
    case Fragment:
      processFragment(vnode, container)
      break
    case Text:
      processText(vnode, container)
      break
    default:
      // 判断 是不是 element
      if (shapeFlags & ShapeFlags.ELEMENT) {
        // element
        processElement(vnode, container)
      } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        // stateful-component
        // 去处理组件
        processComponent(vnode, container)
      }
      break
  }
}

function processText(vnode, container) {
  const { children } = vnode
  const textNode =  (vnode.el = document.createTextNode(children))
  container.append(textNode)
}

function processFragment(vnode, container) {
  mountChildren(vnode, container)  
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const el = (vnode.el =  document.createElement(vnode.type))

  // children ----> 类型 ----> string | array
  const { children, props, shapeFlags } = vnode
  
  if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
    // text_children
    el.textContent = children
  } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    // array_children
    mountChildren(vnode, el)
  }

  // props
  for (const key in props) {
    const val = props[key]
    // 具体的click ---> 重构成通用状态
    // on + Event name
    // 例如 onMousedown
    const isOn = (key: string) => /^on[A-Z]/.test(key) 
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }

  container.append(el)

}

function mountChildren(vnode, container) {
  // 每一个子元素都是虚拟节点 vnode
  vnode.children.forEach((v) => {
    patch(v, container)
  })
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(initialVNode, container) {
  const instance = createComponentInstance(initialVNode)

  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  // vnode 树  ---> patch
  // vnode ---> element ---> mountElement
  patch(subTree, container)

  // element --> mount 知道啥时候完成初始化并且可以获取到el
  initialVNode.el = subTree.el
}


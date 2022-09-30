import { isObject } from "../shared"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {

  // TODO 判读vnode 是不是一个element  是 就走element 逻辑 如何区分是element 还是 component

  // patch 后面的递归处理
  patch(vnode, container)
}

function patch(vnode, container) {
  // 判断 是不是 element
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    // 去处理组件
    processComponent(vnode, container) 
  }
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.type)

  // children ----> 类型 ----> string | array
  const { children, props } = vnode
  
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el)
  }

  // props
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
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

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render()

  // vnode 树  ---> patch
  // vnode ---> element ---> mountElement
  patch(subTree, container)
}


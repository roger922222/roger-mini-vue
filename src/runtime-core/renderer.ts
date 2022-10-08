
import { effect } from "../reactivity/effect"
import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppAPI } from "./createApp"
import { Fragment, Text } from "./vnode"


export function createRenderer(options) {
  // 重新命名，以便后续出问题好查找对应的问题
  const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert } = options

  function render(n2, container) {

    // TODO 判读n1, n2 是不是一个element  是 就走element 逻辑 如何区分是element 还是 component

    // patch 后面的递归处理
    patch(null, n2, container, null)
  }


  // n1 ---> 老的  n2 ---> 新的
  function patch(n1, n2, container, parentComponent) {
    // shapeFlags
    // n1, n2  ---> flag

    // 增加一个Fragment  只渲染children

    const { shapeFlags, type } = n2


    switch(type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        // 判断 是不是 element
        if (shapeFlags & ShapeFlags.ELEMENT) {
          // element
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          // stateful-component
          // 去处理组件
          processComponent(n1, n2, container, parentComponent)
        }
        break
    }
  }

  function processText(n1, n2, container) {
    const { children } = n2
    const textNode =  (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processFragment(n1, n2, container, parentComponent) {
    mountChildren(n1, n2, container, parentComponent)
  }

  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountElement(n1, n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container)
    }
  }

  function patchElement(n1, n2, container) {
    console.log('patchElement')
    console.log('n1', n1)
    console.log('n2', n2)

    // 对比 props 和 chilren
  }

  function mountElement(n1, n2, container, parentComponent) {
    const el = (n2.el = hostCreateElement(n2.type))

    // children ----> 类型 ----> string | array
    const { children, props, shapeFlags } = n2
    
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      // text_children
      el.textContent = children
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      // array_children
      mountChildren(n1, n2, el, parentComponent)
    }

    // props
    for (const key in props) {
      const val = props[key]
      // 具体的click ---> 重构成通用状态
      // on + Event name
      // 例如 onMousedown
      // const isOn = (key: string) => /^on[A-Z]/.test(key) 
      // if (isOn(key)) {
      //   const event = key.slice(2).toLowerCase()
      //   el.addEventListener(event, val)
      // } else {
      //   el.setAttribute(key, val)
      // }
      hostPatchProp(el, key, val)
    }

    // container.append(el)
    hostInsert(el, container)

  }

  function mountChildren(n1, n2, container, parentComponent) {
    // 每一个子元素都是虚拟节点 n1, n2
    n2.children.forEach((v) => {
      patch(null, v, container, parentComponent)
    })
  }

  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  function mountComponent(initialVNode, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect(instance, initialVNode, container) {
    effect(() => {
      // 这里有一个初始化的操作和更新操作
      if (!instance.isMounted) {
        // init
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))

        // n1, n2 树  ---> patch
        // n1, n2 ---> element ---> mountElement
        patch(null, subTree, container, instance)

        // element --> mount 知道啥时候完成初始化并且可以获取到el
        initialVNode.el = subTree.el

        instance.isMounted = true
      } else {
        // update
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        // 重新更新一下之前的subTree
        instance.subTree = subTree

        patch(prevSubTree, subTree, container, instance)
      }
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}


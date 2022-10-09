
import { effect } from "../reactivity/effect"
import { EMPTY_OBJ, isObject } from "../shared/index"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppAPI } from "./createApp"
import { Fragment, Text } from "./vnode"


export function createRenderer(options) {
  // 重新命名，以便后续出问题好查找对应的问题
  const { 
    createElement: hostCreateElement, 
    patchProp: hostPatchProp, 
    insert: hostInsert, 
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options

  function render(n2, container) {

    // TODO 判读n1, n2 是不是一个element  是 就走element 逻辑 如何区分是element 还是 component

    // patch 后面的递归处理
    patch(null, n2, container, null, null)
  }


  // n1 ---> 老的  n2 ---> 新的
  function patch(n1, n2, container, parentComponent, anchor) {
    // shapeFlags
    // n1, n2  ---> flag

    // 增加一个Fragment  只渲染children

    const { shapeFlags, type } = n2


    switch(type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        // 判断 是不是 element
        if (shapeFlags & ShapeFlags.ELEMENT) {
          // element
          processElement(n1, n2, container, parentComponent, anchor)
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          // stateful-component
          // 去处理组件
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break
    }
  }

  function processText(n1, n2, container) {
    const { children } = n2
    const textNode =  (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processFragment(n1, n2, container, parentComponent, anchor) {
    mountChildren(n2.children, container, parentComponent, anchor)
  }

  function processElement(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountElement(n1, n2, container, parentComponent, anchor)
    } else {
      patchElement(n1, n2, container, parentComponent, anchor)
    }
  }

  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log('patchElement')
    console.log('n1', n1)
    console.log('n2', n2)

    // 对比 props 和 chilren

    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)

    patchProps(el, oldProps, newProps)

    patchChildren(n1, n2, el, parentComponent, anchor)

  }

  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const prevShapeFlag = n1.shapeFlags
    const c1 = n1.children
    const nextShapeFlag = n2.shapeFlags
    const c2 = n2.children

    // 1. 老的数组，新的text
    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1. 把老的children清空
        unmountChildren(c1)
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(c2, container, parentComponent, anchor)
      } else {
        // array diff array
        patchKeyedChildren(c1, c2, container, parentComponent, anchor)
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
    let l2 = c2.length, i = 0, e1 = c1.length - 1, e2 = l2 - 1

    function isSomeVNodeType(n1, n2) {
      // type key
      return n1.type === n2.type && n1.key === n2.key
    }

    // 左侧
    while(i <= e1 && i <= e2) {
      const n1 = c1[i], n2 = c2[i]
      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      i++
    }

    // 右侧
    while(i <= e1 && i <= e2) {
      const n1 = c1[e1], n2 = c2[e2]
      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      e1--
      e2--
    }

    // 新的比老的多 创建
    if (i > e1) {
      if (i <= e2) {

        // 增加一个添加节点的参数
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? c2[nextPos].el : null

        while(i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)
          i++
        }
      }
    } else if (i > e2) {
      // 老的比新的多 删除
      while(i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    } else {
      // 中间对比
      let s1 = i, s2 = i, patched = 0

      const toBePatched = e2 - e1 + 1

      const keyToNewIndexMap = new Map()
      // const newIndexToOldIndexMap = new Array(toBePatched)
      
      // for (let i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key, i)
      }

      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i]

        if (patched >= toBePatched) {
          hostRemove(prevChild.el)
          continue
        }

        let newIndex
        if (prevChild.key !== null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          for (let j = s2;  j < e2; j++) {
            if (isSomeVNodeType(prevChild, c2[j])) {
              newIndex = j
              break
            }
          }
        }

        if (newIndex === undefined) {
          hostRemove(prevChild.el)
        } else {
          patch(prevChild, c2[newIndex], container, parentComponent, null)
          patched++
        }
      }
    }

 
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      hostRemove(el)
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]

        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp)
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  function mountElement(n1, n2, container, parentComponent, anchor) {
    const el = (n2.el = hostCreateElement(n2.type))

    // children ----> 类型 ----> string | array
    const { children, props, shapeFlags } = n2
    
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      // text_children
      el.textContent = children
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      // array_children
      mountChildren(n2.children, el, parentComponent, anchor)
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
      hostPatchProp(el, key, null, val)
    }

    // container.append(el)
    hostInsert(el, container, anchor)

  }

  function mountChildren(children, container, parentComponent, anchor) {
    // 每一个子元素都是虚拟节点 n1, n2
    children.forEach((v) => {
      patch(null, v, container, parentComponent, anchor)
    })
  }

  function processComponent(n1, n2, container, parentComponent, anchor) {
    mountComponent(n2, container, parentComponent, anchor)
  }

  function mountComponent(initialVNode, container, parentComponent, anchor) {
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container, anchor)
  }

  function setupRenderEffect(instance, initialVNode, container, anchor) {
    effect(() => {
      console.log('update')
      // 这里有一个初始化的操作和更新操作
      if (!instance.isMounted) {
        // init
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))

        // n1, n2 树  ---> patch
        // n1, n2 ---> element ---> mountElement
        patch(null, subTree, container, instance, anchor)

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

        patch(prevSubTree, subTree, container, instance, anchor)
      }
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}


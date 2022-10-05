const publicPropertiesMap = {
    $el: i => i.vnode.el
};
const PublicInstanceProxyHandles = {
    get({ _: instance }, key) {
        // setupState
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        // key ---> $el
        // if (key === '$el') return instance.vnode.el
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps
    // initSlots
    // 初始化一个有状态的component
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    // ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandles);
    const { setup } = Component;
    if (setup) {
        // return function | object    如果返回的是function就可以认为是组件的render函数，如果返回的object,把对象注入到组件的上下文中
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    //  function Object
    // TODO function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render;
}

function render(vnode, container) {
    // TODO 判读vnode 是不是一个element  是 就走element 逻辑 如何区分是element 还是 component
    // patch 后面的递归处理
    patch(vnode, container);
}
function patch(vnode, container) {
    // shapeFlags
    // vnode  ---> flag
    const { shapeFlags } = vnode;
    // 判断 是不是 element
    if (shapeFlags & 1 /* ShapeFlags.ELEMENT */) {
        // element
        processElement(vnode, container);
    }
    else if (shapeFlags & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        // stateful-component
        // 去处理组件
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    // children ----> 类型 ----> string | array
    const { children, props, shapeFlags } = vnode;
    if (shapeFlags & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        // text_children
        el.textContent = children;
    }
    else if (shapeFlags & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        // array_children
        mountChildren(vnode, el);
    }
    // props
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    // 每一个子元素都是虚拟节点 vnode
    vnode.children.forEach((v) => {
        patch(v, container);
    });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode 树  ---> patch
    // vnode ---> element ---> mountElement
    patch(subTree, container);
    // element --> mount 知道啥时候完成初始化并且可以获取到el
    initialVNode.el = subTree.el;
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        shapeFlags: getShapeFlags(type),
        el: null
    };
    // children
    if (typeof children === 'string') {
        vnode.shapeFlags |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlags |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlags(type) {
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 1. 先转换为虚拟节点 vnode   component (组件)  ---> vnode (虚拟节点)
            // 2. 所有的逻辑操作都会基于vnode做处理
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };

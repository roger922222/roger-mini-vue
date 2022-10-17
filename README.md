# roger-mini-vue
vue3源码重写

实现最简 vue3 模型，用于深入学习 vue3， 更轻松的理解 vue3 的核心逻辑

实现 Vue3 中的核心三大模块

reactivity 响应式 
  reactive， isReactive 实现
  track 收集依赖
  trigger 触发依赖
  effect 实现
  effect 的 scheduler, stop, onStop 实现
  readonly， isReadonly 实现
  shallowReadonly 实现
  isProxy 实现
  ref, isRef, unRef, proxyRefs实现
  computed的实现

runtime运行时
  支持组件类型
  支持element类型
  初始化props
  setup可获取props和context
  支持component的emit
  支持proxy
  可以在render函数中获取setup返回的对象
  支持$el api
  支持 getCurrentInstance
  支持最基础的 slots
  支持 Text 类型节点 Fragment 类型
  支持 provide/inject
  nextTick 的实现
  支持 watchEffect

compiler-core
  解析插值
  解析 element
  解析 text

infrastructure
  support monorepo with pnpm

build
  pnpm build

单元测试 jest vitest

example
  通过serve的方式打开 packages/vue/example/* 下的 index.html 即可






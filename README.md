# roger-mini-vue
vue3源码重写

实现最简 vue3 模型，用于深入学习 vue3， 更轻松的理解 vue3 的核心逻辑

实现 Vue3 中的核心三大模块

# reactivity 响应式

- [x] reactive， isReactive 实现
- [x] track 收集依赖
- [x] trigger 触发依赖
- [x] effect 实现
- [x] effect 的 scheduler, stop, onStop 实现
- [x] readonly， isReadonly 实现
- [x] shallowReadonly 实现
- [x] isProxy 实现
- [x] ref, isRef, unRef, proxyRefs实现
- [x] computed的实现

# runtime运行时
- [x] 支持组件类型
- [x] 支持element类型
- [x] 初始化props
- [x] setup可获取props和context
- [x] 支持component的emit
- [x] 支持proxy
- [x] 可以在render函数中获取setup返回的对象
- [x] 支持$el api
- [x] 支持 getCurrentInstance
- [x] 支持最基础的 slots
- [x] 支持 Text 类型节点 Fragment 类型
- [x] 支持 provide/inject
- [x] nextTick 的实现
- [x] 支持 watchEffect

# compiler-core
- [x] 解析插值
- [x] 解析 element
- [x] 解析 text

# infrastructure
support monorepo with pnpm

# build
  pnpm build

# 单元测试 jest vitest

# example
  通过serve的方式打开 packages/vue/example/* 下的 index.html 即可






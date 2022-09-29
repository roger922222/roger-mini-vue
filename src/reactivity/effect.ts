import { extend } from "../shared"

let activeEffect, shouldTrack

export class ReactiveEffect {
  private _fn: any
  deps = []
  active = true
  onStop?: () => void
  public scheduler: Function | undefined
  constructor(fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }
  run() {
    // 1. 会收集依赖
    // 2. shouldTrack 做区分

    if (!this.active) {
      return this._fn()
    }

    shouldTrack = true
    activeEffect = this
    const result = this._fn()

    // reset
    shouldTrack = false

    return result
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

const targetMap = new Map()
export function track(target, key) {
  // if (!activeEffect) return
  // if (!shouldTrack) return

  if (!isTracking()) return

  // target -> key -> dep
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
 
  let dep = depsMap.get(key)

  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  trackEffects(dep)
   
}

export function trackEffects(dep) {
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function  trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  triggerEffects(dep)

}

export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function effect (fn, options: any = {}) {
  // fn 刚开始要调用一次
  const _effect = new ReactiveEffect(fn, options.scheduler)
  // _effect.onStop = options.onStop
  // options --> 很多key
  // Object.assign(_effect, options)
  // extend 更具有语义化
  extend(_effect, options)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}

export function stop (runner) {
  runner.effect.stop()
}
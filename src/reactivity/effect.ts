class ReactiveEffect {
  private _fn: any
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    return this._fn()  
  }
}

const targetMap = new Map()
export function track(target, key) {
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

  dep.add(activeEffect)
   
}

export function  trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}


let activeEffect
export function effect (fn, options: any = {}) {
  // fn 刚开始要调用一次
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()

  return _effect.run.bind(_effect)
}
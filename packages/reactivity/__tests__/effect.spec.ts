import { effect, stop } from "../src/effect"
import { reactive } from "../src/reactive"
import { vi } from 'vitest'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({ age: 10 })
    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)

    // update
    user.age++
    expect(nextAge).toBe(12)
  })

  it ('should return runner when call effect', () => {
    // 1. effect -> function (runner) -> fn -> return
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe('foo')
  })

  it('scheduler', () => {
    // 1. 通过effect的第二个参数给定的一个scheduler的  fn
    // 2. effect 第一次执行的时候还会执行effect第一个参数的fn
    // 3. 当响应式对象set更新的时候，不会执行effect第一个参数的fn,而是scheduler
    // 4. 如果说执行runner 的时候会再次执行effect的第一个参数的fn 
    let dummy
    let run: any
    const scheduler = vi.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    // 当发生stop后，发生set，不希望更新数据，此时就希望把所有的依赖都删除掉
    stop(runner)
    // obj.prop = 3
    // obj.prop++ obj.prop = obj.prop + 1  涉及到get,set stop只是阻止set,并不能阻止get,  这样会收集依赖，stop清理依赖失败
    obj.prop++
    expect(dummy).toBe(2)

    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  }) 

  it('onStop', () => {
    const obj = reactive({
      foo: 1
    })
    const onStop = vi.fn()
    let dummy
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {
        onStop
      }
    )
 
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})
import { shallowReadonly, isReadonly } from '../src/reactive'
import { vi } from 'vitest'

describe('shallowReadonly', () => {
  test('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({ n: { foo: 1 } })
    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
  })

  it('warn then call set', () => {
    // console.warn

    console.warn = vi.fn()
    const user = shallowReadonly({ age: 1 })
    user.age = 11

    expect(console.warn).toBeCalled()
  })
})
import { isReadonly, readonly } from "../reactive"

describe('readonly', () => {

  it('happy path', () => {


    // not set only read
    const original = { foo: 1, baz: { baz: 2 } }
    const observed = readonly(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
    expect(isReadonly(observed)).toBe(true)
    expect(isReadonly(original)).toBe(false)
  })

  it('warn then call set', () => {
    // console.warn

    console.warn = jest.fn()
    const user = readonly({ age: 1 })
    user.age = 11

    expect(console.warn).toBeCalled() 
  })
})
import { readonly } from "../reactive"

describe('readonly', () => {

  it('happy path', () => {


    // not set only read
    const original = { foo: 1, baz: { baz: 2 } }
    const observed = readonly(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
  })
})
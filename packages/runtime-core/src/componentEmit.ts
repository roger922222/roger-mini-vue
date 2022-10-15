import { camelize, toHandlerKey } from "@roger-mini-vue/shared"

export function emit(instance, event, ...args) {
  // 找到组件的props --->  有没有对应的event  instance.props
  const { props } = instance

  // TPP
  // 先去写一个特定的行为  ---》 重构成通用的行为
  // add 
  // add-foo ----> addFoo
  // onAdd 来源于 event  add   ---->  转为首字母大写 Add
  // const handler = props['onAdd']
  // handler && handler()

  // // 串联形式变为驼峰命名的方式
  // const camelize = (str: string) => {
  //   // 第一个参数获取的是-(\w)  第二个参数获取的是括号里面的
  //   return str.replace(/-(\w)/g, (_, c: string) => {
  //     return c ? c.toUpperCase() : ''
  //   })
  // }

  // //  获取首字母 charAt(0) 转为大写
  // const capitalize = (str: string) => {
  //   return str.charAt(0).toUpperCase() + str.slice(1)
  // }


  // // 处理on的行为
  // const toHandlerKey = (str: string) => {
  //   return str ? 'on' + capitalize(str) : ''
  // }

  const handlerName = toHandlerKey(camelize(event))
  const handler = props[handlerName]
  handler && handler(...args)

}
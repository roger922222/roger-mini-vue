const ShapeFlags = {
  element: 0,
  stateful_component: 0,
  text_children: 0,
  array_children: 0,
}

// vnode -> stateful_component -> 
// 1. 可以设置 修改
// ShapeFlags.stateful_component = 1
// ShapeFlags.array_children = 1

// 2. 查找
// if (ShapeFlags.element)
// if (ShapeFlags.stateful_component)


// key ---  value  形式不够高效   可以通过位运算  的方式来解决
// 0000
// 0001 ---> element
// 0010 ---> stateful
// 0100 ---> text_children
// 1000 ---> array_children


// 如果是stateful与 array_children  可以表示为1010


// | (两位都为0，才为0)
// & (两位都为1，才为1)


// 修改
// 0000 | 0001  得到 0001   (两位都为0，才为0)

// 查找
// 0001 & 0001 得到 0001 (两位都为1，才为1)
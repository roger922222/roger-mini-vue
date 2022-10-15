import typescript from "@rollup/plugin-typescript"
export default {
  input: "./packages/vue/src/index.ts",
  output: [ // 打包类型 1. cjs ---> common.js  2. esm
    {
      format: "cjs", // 打包成什么类型
      file: 'packages/vue/dist/roger-mini-vue.cjs.js'
    },
    {
      format: "es", // 打包成什么类型
      file: 'packages/vue/dist/roger-mini-vue.esm.js'
    }
  ],

  plugins: [
    typescript()
  ]
}
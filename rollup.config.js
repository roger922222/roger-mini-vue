import typescript from "@rollup/plugin-typescript"
import pkg from './package.json'
export default {
  input: "./src/index.ts",
  output: [ // 打包类型 1. cjs ---> common.js  2. esm
    {
      format: "cjs", // 打包成什么类型
      file: pkg.main
    },
    {
      format: "es", // 打包成什么类型
      file: pkg.module
    }
  ],

  plugins: [
    typescript()
  ]
}
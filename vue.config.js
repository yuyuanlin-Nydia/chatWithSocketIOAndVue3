// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
module.exports = {
  // 以上是 default 的樣子

  // 建立 config 物件
  css: {
    loaderOptions: {
      sass: {
        // scss 的檔名記得加 ; 而且是要加在 double quote 之外！！
        // `@import "path..";`
        additionalData: '@import "@/assets/scss/colorVariable.scss";'
      }
    }
  },
  chainWebpack: (config) => {
    config.module.rule('javascript/auto').test(/\.mjs$/).end()
  }
}

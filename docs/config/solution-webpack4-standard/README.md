---
sidebar: auto
---

# webpack4-standard

## 基础配置


### index
- Type: `String` | `Object`
- Default： `false`

主页模板，默认为 `false`，当index为 `string` 时，将视为文件名，目录为 `b.config.js` 所在目录

::: tip 示例
例如：`b.config.js` 所在目录为 `/workspace/demo/src/hello/`

当 `index` 为 `demo.html`时，则会将 `/workspace/demo/src/hello/demo.html` 生成 `index.html`  
当 `index` 为 `object` 时，将通过 `Object.assign` 方法覆盖默认配置作为 `HtmlWebpackPlugin` 的参数  
当 `index` 为 `false` 时，则不添加 `HtmlWebpackPlugin` 插件  
:::
---
sidebar: auto
---

# CLI配置

`b.config.js` 是一个可选的配置文件，如果项目的 (与 `package.json` 同级的) 根目录中存在这个文件，那么它会被 `@bfunjs/bfun-cli` 自动加载使用。你也可以使用 `--config <path>` 指定文件路径，如果不是以 `.js` 结尾，那么它会自动寻找 `b.config.js` 文件作为配置文件。

这个文件应该导出一个包含了相关配置的对象：

``` js
// b.config.js
module.exports = {
    debug: false,
    framework: 'webpack',
    sourceMap: false,
    devServer: {
        host: '0.0.0.0',
        port: 6699,
    },
    solutions: [
        {
            solution: '@bfun/solution-webpack4-standard',
            /**
             * index默认为false
             *
             * 当index为string时，将视为文件名，目录为 b.config.js 所在目录
             * 例如：b.config.js 所在目录为 /home/workspace/demo/src/hello/
             * index: 'demo.html'
             * 则会使用HtmlWebpackPlugin打包/home/workspace/demo/src/hello/demo.html生成index.html
             *
             * 当index为object时，将通过 Object.assign 方法覆盖默认配置作为 new HtmlWebpackPlugin({}) 的参数生成配置
             *
             * 当index为false时，则跳过 HtmlWebpackPlugin
             */
            index: false,
            /**
             * template默认为false
             *
             * 当template为string时，将视为文件名，目录为 b.config.js 所在目录
             * 例如：b.config.js 所在目录为 /home/workspace/demo/src/hello/
             * template: 'demo.html'
             * 则会使用HtmlWebpackPlugin打包/home/workspace/demo/src/hello/demo.html生成index.template.html
             *
             * 当template为object时，将通过 Object.assign 方法覆盖默认配置作为 new HtmlWebpackPlugin({}) 的参数生成配置
             *
             * 当template为false时，则跳过 HtmlWebpackPlugin
             */
            template: false,
            /**
             * 打包相关 .png/.jpg/.gif/.svg 等资源
             *
             * 若为object，将通过 Object.assign 方法覆盖默认配置作为新参数生成配置
             */
            assets: true,
            /**
             * 支持ES6语法
             *
             * 若为object，将通过 Object.assign 方法覆盖默认配置作为新参数生成配置
             */
            babel: true,
            /**
             * 字体文件打包
             *
             * 若为object，将通过 Object.assign 方法覆盖默认配置作为新参数生成配置
             */
            fonts: true,
            /**
             * LESS支持
             *
             * 若为object，将通过 Object.assign 方法覆盖默认配置作为新参数生成配置
             */
            less: true,
            /**
             * CSS支持
             *
             * 若为object，将通过 Object.assign 方法覆盖默认配置作为新参数生成 MiniCssExtractPlugin 配置
             */
            style: true,
            /**
             * 是否展示Webpack构建进度条
             */
            progress: true,

            /**
             * 原生 webpack 配置
             * 将使用 webpack-merge 合并
             */
            wConfig: {},
        },
    ],
};

```

## framework
- Type: `String`
- Default： `"webpack"`

项目框架，默认支持了 `webpack`、`react`、`vue`、`vue` 3种类型，后续会继续支持更多配置


## sourceMap
- Type: `Boolean`
- Default： `false`

仅在 `bfun build` 时可用，值为 `true` 时会生成sourceMap文件


## devServer
- Type: `Object`
- Default: `{}`

### host
- Type: `String`
- Default： `0.0.0.0`

同 `webpack` 配置中的 `devServer.hostname`


### port
- Type: `Number`
- Default： `6699`

同 `webpack` 配置中的 `devServer.port`，当配置的端口被占用时，会自动寻找下一个可用的端口，例如当6699端口被占用时，会自动使用6670作为监听的端口


## solutions
- Type： `Array`
- Default： `[]`

::: tip 关于solutions
solution中的配置将会全部传递给对应的solution进行处理，从而生成配置
:::


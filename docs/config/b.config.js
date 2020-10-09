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

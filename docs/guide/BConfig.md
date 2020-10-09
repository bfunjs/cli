# 配置文件

默认配置文件名为：`b.config.js`。默认使用根目录下的`b.config.js`文件，如果没有则会使用默认配置，默认配置为：

``` javascript
module.exports = {
  framework: 'webpack',
  solutions: ['@bfun/solution-webpack4-standard'],
};
```

常用配置：

```javascript
module.exports = {
  debug: false, // 是否输出调试信息
  framework: 'webpack', // 可选（默认为webpack），可根据 solutions 自定义
  sourceMap: false, // 是否生成 sourceMap，默认为 false
  devServer: { // 仅在dev有效，用于开发服务
    host: '0.0.0.0',
    port: 6699, // 端口被占用会自动寻找下一个可用端口
  },
  solutions: [
    {
      solution: '@bfun/solution-webpack4-standard'
    }
  ],
  configure: function(chain, index) {
    // 对于所有的webpack配置，都会调用此方法，可在这里对webpack进行自定义
    return true;
  }
};
```
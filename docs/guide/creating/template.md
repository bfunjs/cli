# 创建模板框架

bfun CLI 支持三种模式的模板，本地文件目录、GIT仓库、NPM仓库

## 创建一个简单的模板仓库

接下来会创建一个简单的模版仓库来进行教学，你也可以在此基础上进行任意的扩展  
最终目录结构如下：

```
+ my-projects  
    + my-app  
        + index.js  
        + index.html  
        + package.json  
+ b.entry.js
```

首先，我们需要先配置入口文件 **b.entry.js**

```javascript
// 首先，我们先引入一些 [Node.js](https://nodejs.org/)  通用的依赖
const { join } = require('path');

// 然后定义一下我们的模板项目
const projects = [
    {
        name: '自定义的AppName',
        type: 'dir',
        url: join(__dirname, 'my-projects/my-app')
    }
    // ...
];

// 其次，我们可能需要在创建的过程中提问
const basicQA = [
    {
        type: 'input',
        message: '请输入项目名',
        name: 'name',
        default: process.cwd().split('/').pop()
    },
    {
        type: 'input',
        message: '请输入作者名',
        name: 'author'
    },
    {
        type: 'input',
        message: '请输入项目简介',
        name: 'description'
    },
    {
        type: 'list',
        name: 'type',
        message: '请选择项目模板',
        choices: projects.map(item => item.name)
    }
];

// 好了，我们可以导出这些配置了
module.exports = {
    minVersion: '1.0.1',
    maxVersion: '2.0.0',
    async initial({ inquirer, dist }) {
        const basicData = await inquirer.prompt(basicQA);
        const appInfo = projects.find(item => item.name === basicData.type);
        return {
            type: appInfo.type,
            url: appInfo.url,
            context: {
                ...basicData
            }
        }
    },
};
```

接下来我们可以初始化 **my-projects/my-app** 下的相关文件了  
在 **my-projects/my-app** 执行：

```bash
npm init
```

完成后稍微修改一下 **package.json**
```json
{
  "name": "{{name}}",
  "version": "1.0.0",
  "description": "{{description}}",
  "main": "index.js",
  "scripts": {
    "dev": "bfun dev",
    "build": "bfun build"
  },
  "author": "{{author}}",
  "license": "ISC",
  "dependencies": {
    "vue": "^2.6.10",
    "vue-router": "^3.1.3"
  },
  "devDependencies": {
     "@bfunjs/bfun-cli": "2"
  }
}
```

所有文件都是可以完全支持模板语法的
```javascript
// index.js
console.log('hello, {{name}}');
console.log('author: {{author}}');
```

修改完即可在根目录下执行 bfun config 命令来进行配置了  
你也可以这些改动发布至git、npm

## 使用本地目录作为模板
```bash
bfun config --dir < dir name >
```

## 使用GIT仓库作为模板
```bash
bfun config --git < git repo >
```

## 使用NPM仓库作为模板
```bash
bfun config --npm < npm repo >
```

---
sidebarDepth: 0
---

# 使用指南

bfun CLI 是一个可自由搭建项目的脚手架。支持使用插件`@bfun/plugin`来自定义命令和脚本，也可使用解决方案`@bfun/solution`来自定义项目  

::: tip Node 版本要求
@bfun/cli 建议 [Node.js](https://nodejs.org/) 6.9 或更高版本。你可以使用 [nvm](https://github.com/creationix/nvm) 或 [nvm-windows](https://github.com/coreybutler/nvm-windows) 在同一台电脑中管理多个 Node 版本。
:::


可以使用下列任一命令安装最新的包：

``` bash
npm install @bfun/cli -g

# OR
yarn global add @bfun/cli
```

安装之后，你就可以在命令行中访问 `bfun` 命令。你可以通过简单运行 `bfun`，看看是否展示出了一份所有可用命令的帮助信息，来验证它是否安装成功。

你还可以用这个命令来检查其版本是否正确：

```bash
bfun -v
```

# 初始化项目

``` bash
bfun init <name>

# OR
mkdir my-project && cd my-project
bfun init
```

# 启动开发服务

``` bash
bfun dev

# OR 指定配置目录
bfun dev --config ./src/app

# OR 指定配置文件
bfun dev --config ./src/app/b.config.js
```


# 构建

``` bash
bfun build

# OR 指定配置目录
bfun build --config ./src/app

# OR 指定配置文件
bfun build --config ./src/app/b.config.js
```


# 部署

``` bash
bfun deploy

# OR 指定配置目录
bfun deploy --config ./src/app

# OR 指定配置文件
bfun deploy --config ./src/app/b.config.js
```

# 其它

bfun CLI 默认支持以下命令：

``` bash
bfun init [name]
bfun dev
bfun build
bfun deploy
bfun page [name]
bfun login
bfun publish
bfun get <key>
bfun set <key> <value>
bfun use <@bfun/plugins>
```
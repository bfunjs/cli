@bfun/cli
=================

@bfun/cli


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@bfun/cli.svg)](https://npmjs.org/package/@bfun/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@bfun/cli.svg)](https://npmjs.org/package/@bfun/cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @bfun/cli
$ bfun COMMAND
running command...
$ bfun (--version|-v)
@bfun/cli/5.2.0 darwin-arm64 node-v24.14.0
$ bfun --help [COMMAND]
USAGE
  $ bfun COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bfun deploy [DIR]`](#bfun-deploy-dir)
* [`bfun init [DIR]`](#bfun-init-dir)
* [`bfun login`](#bfun-login)
* [`bfun semver [DIR]`](#bfun-semver-dir)

## `bfun deploy [DIR]`

部署项目到云端

```
USAGE
  $ bfun deploy [DIR]

ARGUMENTS
  [DIR]  [default: .] 要部署的项目目录，默认为当前执行命令的目录

DESCRIPTION
  部署项目到云端

EXAMPLES
  $ bfun deploy

  $ bfun deploy ./my-project
```

_See code: [src/commands/deploy.ts](https://github.com/bfunjs/cli/blob/v5.2.0/src/commands/deploy.ts)_

## `bfun init [DIR]`

获取应用配置并设置项目的 Umi publicPath

```
USAGE
  $ bfun init [DIR]

ARGUMENTS
  [DIR]  [default: .] 要初始化的项目目录，默认为当前执行命令的目录

DESCRIPTION
  获取应用配置并设置项目的 Umi publicPath

EXAMPLES
  $ bfun init

  $ bfun init ./my-project
```

_See code: [src/commands/init.ts](https://github.com/bfunjs/cli/blob/v5.2.0/src/commands/init.ts)_

## `bfun login`

保存 bfun 登录配置

```
USAGE
  $ bfun login [-e dev|pre|prod]

FLAGS
  -e, --env=<option>  [default: prod] 命令行执行环境
                      <options: dev|pre|prod>

DESCRIPTION
  保存 bfun 登录配置

EXAMPLES
  $ bfun login
```

_See code: [src/commands/login.ts](https://github.com/bfunjs/cli/blob/v5.2.0/src/commands/login.ts)_

## `bfun semver [DIR]`

按照 SemVer 规范更新 package.json 中的版本号

```
USAGE
  $ bfun semver [DIR]

ARGUMENTS
  [DIR]  [default: .] 需要更新版本号的项目目录，默认为当前执行命令的目录

DESCRIPTION
  按照 SemVer 规范更新 package.json 中的版本号

EXAMPLES
  $ bfun semver

  $ bfun semver ./my-project
```

_See code: [src/commands/semver.ts](https://github.com/bfunjs/cli/blob/v5.2.0/src/commands/semver.ts)_
<!-- commandsstop -->

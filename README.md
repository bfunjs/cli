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
@bfun/cli/5.0.2 linux-x64 node-v24.18.0
$ bfun --help [COMMAND]
USAGE
  $ bfun COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bfun deploy [DIR]`](#bfun-deploy-dir)
* [`bfun login`](#bfun-login)

## `bfun deploy [DIR]`

部署项目到云端

```
USAGE
  $ bfun deploy [DIR] [-f]

ARGUMENTS
  [DIR]  [default: .] 要部署的项目目录，默认为当前执行命令的目录

FLAGS
  -f, --force  强制部署，不检查版本

DESCRIPTION
  部署项目到云端

EXAMPLES
  $ bfun deploy

  $ bfun deploy ./my-project
```

_See code: [src/commands/deploy.ts](https://github.com/bfunjs/cli/blob/v5.0.2/src/commands/deploy.ts)_

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

_See code: [src/commands/login.ts](https://github.com/bfunjs/cli/blob/v5.0.2/src/commands/login.ts)_
<!-- commandsstop -->

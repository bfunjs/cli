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
$ bfun (--version)
@bfun/cli/5.0.0 darwin-arm64 node-v24.14.0
$ bfun --help [COMMAND]
USAGE
  $ bfun COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bfun help [COMMAND]`](#bfun-help-command)
* [`bfun login`](#bfun-login)
* [`bfun plugins`](#bfun-plugins)
* [`bfun plugins add PLUGIN`](#bfun-plugins-add-plugin)
* [`bfun plugins:inspect PLUGIN...`](#bfun-pluginsinspect-plugin)
* [`bfun plugins install PLUGIN`](#bfun-plugins-install-plugin)
* [`bfun plugins link PATH`](#bfun-plugins-link-path)
* [`bfun plugins remove [PLUGIN]`](#bfun-plugins-remove-plugin)
* [`bfun plugins reset`](#bfun-plugins-reset)
* [`bfun plugins uninstall [PLUGIN]`](#bfun-plugins-uninstall-plugin)
* [`bfun plugins unlink [PLUGIN]`](#bfun-plugins-unlink-plugin)
* [`bfun plugins update`](#bfun-plugins-update)
* [`bfun publish [DIR]`](#bfun-publish-dir)

## `bfun help [COMMAND]`

Display help for bfun.

```
USAGE
  $ bfun help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for bfun.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.2.49/src/commands/help.ts)_

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

_See code: [src/commands/login.ts](https://github.com/bfunjs/cli/blob/v5.0.0/src/commands/login.ts)_

## `bfun plugins`

List installed plugins.

```
USAGE
  $ bfun plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ bfun plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/index.ts)_

## `bfun plugins add PLUGIN`

Installs a plugin into bfun.

```
USAGE
  $ bfun plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into bfun.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the BFUN_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the BFUN_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ bfun plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ bfun plugins add myplugin

  Install a plugin from a github url.

    $ bfun plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ bfun plugins add someuser/someplugin
```

## `bfun plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ bfun plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ bfun plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/inspect.ts)_

## `bfun plugins install PLUGIN`

Installs a plugin into bfun.

```
USAGE
  $ bfun plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into bfun.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the BFUN_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the BFUN_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ bfun plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ bfun plugins install myplugin

  Install a plugin from a github url.

    $ bfun plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ bfun plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/install.ts)_

## `bfun plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ bfun plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ bfun plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/link.ts)_

## `bfun plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ bfun plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bfun plugins unlink
  $ bfun plugins remove

EXAMPLES
  $ bfun plugins remove myplugin
```

## `bfun plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ bfun plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/reset.ts)_

## `bfun plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ bfun plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bfun plugins unlink
  $ bfun plugins remove

EXAMPLES
  $ bfun plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/uninstall.ts)_

## `bfun plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ bfun plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ bfun plugins unlink
  $ bfun plugins remove

EXAMPLES
  $ bfun plugins unlink myplugin
```

## `bfun plugins update`

Update installed plugins.

```
USAGE
  $ bfun plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.68/src/commands/plugins/update.ts)_

## `bfun publish [DIR]`

发布项目到云端

```
USAGE
  $ bfun publish [DIR] [-f]

ARGUMENTS
  [DIR]  [default: .] 要发布的项目目录，默认为当前执行命令的目录

FLAGS
  -f, --force  强制发布，不检查版本

DESCRIPTION
  发布项目到云端

EXAMPLES
  $ bfun publish

  $ bfun publish ./my-project
```

_See code: [src/commands/publish.ts](https://github.com/bfunjs/cli/blob/v5.0.0/src/commands/publish.ts)_
<!-- commandsstop -->

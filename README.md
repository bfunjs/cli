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
@bfun/cli/0.0.0 darwin-arm64 node-v24.14.0
$ bfun --help [COMMAND]
USAGE
  $ bfun COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bfun hello PERSON`](#bfun-hello-person)
* [`bfun hello world`](#bfun-hello-world)
* [`bfun help [COMMAND]`](#bfun-help-command)
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

## `bfun hello PERSON`

Say hello

```
USAGE
  $ bfun hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ bfun hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/cli/suibinc/blob/v0.0.0/src/commands/hello/index.ts)_

## `bfun hello world`

Say hello world

```
USAGE
  $ bfun hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ bfun hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/cli/suibinc/blob/v0.0.0/src/commands/hello/world.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.2.46/src/commands/help.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/index.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/inspect.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/install.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/link.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/reset.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/uninstall.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.63/src/commands/plugins/update.ts)_
<!-- commandsstop -->

import { Command, Flags, Interfaces } from '@oclif/core';
import { compareVersions } from 'compare-versions';
import cp from 'node:child_process';

import { ENV_FLAG } from '../constants/index.js';
import { checkCliVersion } from '../shared/check.js';
import { logger } from '../shared/logger.js';

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<
  (typeof BaseCommand)['baseFlags'] & T['flags']
>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>;

const minNodeVersion = '16.9.0';

export abstract class BaseCommand<T extends typeof Command> extends Command {
  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {
    env: Flags.option(ENV_FLAG)(),
  };
  protected args!: Args<T>;
  protected flags!: Flags<T>;

  protected async catch(err: Error & { exitCode?: number }) {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err);
  }

  protected async finally(_: Error | undefined) {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_);
  }

  public async init(): Promise<void> {
    await super.init();
    const { args, flags } = await this.parse({
      args: this.ctor.args,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      flags: this.ctor.flags,
      strict: this.ctor.strict,
    });
    this.flags = flags as Flags<T>;
    this.args = args as Args<T>;

    // 检测 node 版本
    const currentVersion = cp.execSync('node --version').toString().trim();
    if (compareVersions(currentVersion, minNodeVersion) < 1) {
      logger.error(`@bfun/cli 需要 Node.js 版本在 ${minNodeVersion}+`);
      this.error(`@bfun/cli 需要 Node.js 版本在 ${minNodeVersion}+`);
    }

    process.env.NODE_ENV = 'production';
    process.env.DEBUG = 'true';
    process.env.isLocal = 'false';

    await checkCliVersion();
  }
}

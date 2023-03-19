import { Middleware } from '@bfun/runtime';
import { logger } from '../shared/logger';
import { readConfig } from '../shared/middleware/config';
import { execAll } from '../shared/solutions';

import { InitObj, Lifecycle, Use } from '../types';
import { Context } from './Context';

export class Application {
    private readonly lifecycle: Lifecycle;

    private readonly ctx: Context;

    constructor(command?: string) {
        this.ctx = new Context();

        this.lifecycle = {
            before: new Middleware(),
            execute: new Middleware(),
            after: new Middleware(),
        };
    }

    async initPresets() {
        console.log(this.ctx);
    }

    async initPlugins() {

    }

    async resolveConfig() {

    }

    async runCommand() {

    }

    async run() {
        // await this.init();
        await this.initPresets();
        await this.initPlugins();
        await this.resolveConfig();
        await this.runCommand();

        // todo runCommand
    }

    async execute() {
        if (!this.command) return;

        const ctx: Context = { name: this.command, opts: this.opts, args: this.args.slice(1), help: [] };
        const { before, execute, after } = this.lifecycle;

        if (this.notMatched) {
            before.use(readConfig);
            execute.use(execAll);
        }

        await before.run(ctx);
        await execute.run(ctx);
        await after.run(ctx);

        if (this.opts.help) this.showHelp(ctx);
    }

    showHelp(ctx: Context) {
        const help = ctx.help.filter((v: unknown) => typeof v === 'object');
        const options = Object.assign.apply(this, [ {}, ...help ]);

        Object.keys(options).map(key => logger.info(key, '\t\t', options[key]));
    }

    register: Use = (command: string, lifecycle: InitObj) => {
        if (command === this.command || command === '*') {
            const { before, execute, after } = this.lifecycle;
            if (this.opts.help) {
                lifecycle.help && lifecycle.help.map(fn => typeof fn === 'function' && execute.use(fn));
            } else {
                this.notMatched = false;
                lifecycle.before && lifecycle.before.map(fn => typeof fn === 'function' && before.use(fn));
                lifecycle.execute && lifecycle.execute.map(fn => typeof fn === 'function' && execute.use(fn));
                lifecycle.after && lifecycle.after.map(fn => typeof fn === 'function' && after.use(fn));
            }
        }
    };
}

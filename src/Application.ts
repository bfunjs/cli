import optimist from 'optimist';
import { Middleware } from '@bfun/runtime';

import { Context, InitObj, Lifecycle, Use } from './types';
import scripts from './scripts';
import { logger } from './shared/logger';
import { execAll } from './shared/solutions';
import { readConfig } from './shared/middleware/config';

export class Application {
    private readonly command: string;
    private readonly args: string[];
    private readonly opts: { [key: string]: string };
    private readonly lifecycle: Lifecycle;
    private notMatched: boolean;

    constructor(command?: string) {
        const { _: args, ...opts } = optimist.argv;

        this.args = args || [];
        this.opts = opts || {};
        this.command = command || this.args[0] || '';
        this.notMatched = true;

        this.lifecycle = {
            before: new Middleware(),
            execute: new Middleware(),
            after: new Middleware(),
        };

        if (!this.command && (this.opts.v || this.opts.version)) {
            console.log(global.version);
            return;
        } else {
            logger.green('当前', global.name, '版本为：', global.version).line();
        }

        scripts.map(init => init(this.register));
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

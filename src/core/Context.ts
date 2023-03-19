import optimist from 'optimist';
import { logger } from '../shared/logger';
import { readConfig } from '../shared/middleware/config';
import { execAll } from '../shared/solutions';

import { InitObj, Use } from '../types';
import { Plugin } from './Plugin';

export class Context extends Plugin {
    private readonly command: string;
    private readonly args: string[];
    private readonly opts: { [key: string]: string };

    public readonly name: string;
    public readonly version: string;

    public rootDir: string;
    public userDir: string;

    public userConfig: Record<string, any>;
    private plugins: any[] = [];

    constructor() {
        super();
        const { _: args, ...opts } = optimist.argv;

        this.args = args || [];
        this.opts = opts || {};
        this.command = this.args[0] || '';

        const { name, version } = require('../package.json');
        this.name = name;
        this.version = version;
        this.rootDir = process.cwd();
        this.userDir = process.env.HOME || process.env.USERPROFILE || '';

        if (!this.command && (this.opts.v || this.opts.version)) {
            logger.green(this.version);
            return;
        }
        logger.green(name, ':', version).line();
    }

    run() {
        if (!this.command) return;
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

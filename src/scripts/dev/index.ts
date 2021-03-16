import { Context, BContext, Use } from '../../types';
import { readConfig } from '../../shared/middleware/config';
import { findPort } from '../../shared/devlopment';
import { execSolutions } from '../../shared/solutions';

const command = 'dev';

async function initEnv(ctx: BContext, next: any) {
    process.env.NODE_ENV = 'development';
    process.env.isLocal = 'true';

    await next();
}

async function dev(ctx: BContext, next: any) {
    const { bConfig, opts } = ctx;
    const { devServer = {} } = bConfig;
    ctx.host = opts.host || devServer.host || '0.0.0.0';
    ctx.port = await findPort(opts.port || devServer.port);

    await execSolutions(ctx, next, command);
}

async function help(ctx: Context, next: any) {
    ctx.help.push({
        '-c --config [config]': 'config filepath',
        '-h, --host [host]': 'host',
        '-p, --port [port]': 'port',
        '--type [type]': 'build type, default: function',
    });

    await next();
}

export default function (use: Use) {
    const lifecycle = {
        before: [ initEnv, readConfig ],
        execute: [ dev ],
        help: [ help ],
    };
    use(command, lifecycle);
};

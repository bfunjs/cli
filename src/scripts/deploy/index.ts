import { Context, BContext, Use } from '../../types';
import { readConfig } from '../../shared/middleware/config';
import { execSolutions } from '../../shared/solutions';

const command = 'deploy';

async function initEnv(ctx: BContext, next: any) {
    process.env.NODE_ENV = 'production';
    process.env.isLocal = 'false';

    await next();
}

async function deploy(ctx: BContext, next: any) {
    await execSolutions(ctx, next, command);
}

async function help(ctx: Context, next: any) {
    ctx.help.push({});

    await next();
}

export default function (use: Use) {
    const lifecycle = {
        before: [ initEnv, readConfig ],
        execute: [ deploy ],
        help: [ help ],
    };
    use(command, lifecycle);
};

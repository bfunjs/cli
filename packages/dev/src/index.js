const { readBConfig, findPort, execBfunSolutions } = global.common;

const command = 'dev';

async function initEnv(ctx, next) {
    process.env.NODE_ENV = 'development';
    process.env.isLocal = 'true';

    await next();
}

async function dev(ctx, next) {
    const { bConfig = {}, opts } = ctx;
    const { devServer = {} } = bConfig;
    ctx.host = opts.host || devServer.host || '0.0.0.0';
    ctx.port = await findPort(opts.port || devServer.port || 6699);

    await execBfunSolutions(ctx, next, command);
}

export const when = [command];

export function bfun(use) {
    use(command).option('-c, --config [config]', 'config filepath')
        .option('-h, --host [host]', 'host')
        .option('-p, --port [port]', 'port');
    return {
        [command]: {
            before: [initEnv, readBConfig],
            execute: [dev],
        },
    };
}

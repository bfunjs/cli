const { readBConfig, execBfunSolutions } = global.common;

const command = 'deploy';

async function initEnv(ctx, next) {
    if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
    if (!process.env.isLocal) process.env.isLocal = 'false';

    await next();
}

async function deploy(ctx, next) {
    await execBfunSolutions(ctx, next, command);
}

export const when = [ command ];

export function bfun(use) {
    use(command).option('-c, --config [config]', 'config filepath');
    return {
        [command]: {
            before: [ initEnv, readBConfig ],
            execute: [ deploy ],
        },
    };
}

const { readBConfig, execBfunSolutions } = global.common;

const command = 'build';

async function initEnv(ctx, next) {
    process.env.NODE_ENV = 'production';
    process.env.isLocal = 'false';

    await next();
}

async function build(ctx, next) {
    await execBfunSolutions(ctx, next, command);
}

export const when = [command];

export function bfun(use) {
    use(command).option('-c, --config [config]', 'config filepath')
        .option('--type [type]', 'build type, default: function')
        .option('--vue [vue]', 'build type [vue]')
        .option('--react [react]', 'build type [react]');
    return {
        [command]: {
            before: [initEnv, readBConfig],
            execute: [build],
        },
    };
}

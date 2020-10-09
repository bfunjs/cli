const chalk = require('chalk');
const program = require('commander');
const { Middleware } = require('@bfun/runtime');
const { checkLatestVersion, logger, bfunRequire, getLoaders } = require('./common');

async function exec(lifecycle, name, opts, args) {
    logger.log(chalk.blod(chalk.green(`当前 @bfun/cli 版本为：${global.version}`)));

    const ctx = { name, opts, args };
    if (lifecycle.before) await lifecycle.before.run(ctx);
    if (lifecycle.execute) await lifecycle.execute.run(ctx);
    if (lifecycle.after) await lifecycle.after.run(ctx);
}

module.exports = async () => {
    await checkLatestVersion();

    const command = process.argv[2] || '';
    const lifecycle = {};
    const useFn = function (name) {
        if (!name) return;
        return program.command(name)
            .description(name)
            .action((...args) => {
                const last = args.pop();
                exec(lifecycle, last._name, last.opts(), args);
            });
    };

    const loaders = await getLoaders();
    for (let i = 0, l = loaders.length; i < l; i++) {
        const { name } = loaders[i];
        const loader = bfunRequire(name);
        if (!loader || typeof loader !== 'object') continue;
        const { bfun, when = [] } = loader;
        if (when && ['-h', '--help', ...when].indexOf(command) < 0) continue;

        const { [command]: actions } = await bfun(useFn);
        if (typeof actions !== 'object') continue;
        ['before', 'execute', 'after'].map(key => {
            if (!lifecycle[key]) lifecycle[key] = new Middleware();
            const list = actions[key] instanceof Array ? actions[key] : [actions[key]];
            list.map(fn => typeof fn === 'function' && lifecycle[key].use(fn));
        });
    }

    program.version(global.version, '-v, --version').parse(process.argv);
};

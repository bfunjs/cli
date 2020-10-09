const { Middleware } = require('@bfun/runtime');

const { installAndRequire } = require('./shared');
const { logger } = require('./logger');

function parseSolutionName(name) {
    return (name.startsWith('@bfun/') && !name.startsWith('@bfun/solution-'))
        ? `@bfun/solution-${name.slice(6)}` : name;
}

async function loadBfunSolutions(args, framework, parent) {
    const list = args instanceof Array ? args : [args];
    let solutions = parent || [];

    for (const value of list) {
        let config = value;
        if (typeof value === 'string') config = { solution: value };
        if (typeof config !== 'object') continue;
        config.solution = parseSolutionName(config.solution);

        const { solution, ...options } = config;
        if (solutions.findIndex(v => v.solution === solution) >= 0) continue;

        const init = await installAndRequire(solution);
        if (typeof init === 'function') {
            solutions.push({ solution, options, init });
        } else if (typeof init === 'object') {
            let { extensions, required } = init;
            if (!parent && required instanceof Array) {
                if (required.indexOf(framework) < 0) continue;
            }
            if (typeof extensions === 'string') extensions = [extensions];
            if (extensions instanceof Array) {
                extensions = extensions.filter(extension => typeof extension === 'string');
                if (extensions.length > 0) solutions = await loadBfunSolutions(extensions, framework, solutions);
            }
            solutions.push({ solution, options, ...init });
        } else {
            logger.error('invalid solution :', solution);
            process.exit(-1);
        }
    }

    return solutions;
}

function initFn(solution, fn, options, type = 'init') {
    return async (ctx, next) => {
        const { skip } = ctx.solution;
        if (skip.indexOf(`${solution}:*`) >= 0 || skip.indexOf(`${solution}:${type}`) >= 0) await next();
        else await fn(ctx, next, options);
    };
}

async function execBfunSolutions(ctx, next, command) {
    const { bConfig = {} } = ctx;
    const { framework, solutions = [] } = bConfig;

    ctx.solution = { skip: [], options: {} };
    const bfunSolutions = await loadBfunSolutions(solutions, framework);
    if (bfunSolutions.length < 1) throw new Error(`framework[${framework}] not supported`);

    const initial = new Middleware();
    const handler = new Middleware();
    let solutionOptions = {};
    bfunSolutions.map(({ solution, options, init, [command]: exec }) => {
        if (typeof init === 'function') initial.use(initFn(solution, init, options));
        if (typeof exec === 'function') handler.use(initFn(solution, exec, options, command));
        if (typeof options === 'object') solutionOptions = Object.assign(solutionOptions, options);
    });
    ctx.solution.options = solutionOptions;

    await next();

    await initial.run(ctx);
    await handler.run(ctx);
}

module.exports = {
    loadBfunSolutions,
    execBfunSolutions,
};

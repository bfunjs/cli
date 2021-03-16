import { Middleware } from '@bfun/runtime';

import { Solution, BContext } from '../types';
import { logger } from './logger';
import { installAndRequire, toCamel } from './util';

interface ISolution {
    name: string;
    options: any;
    version: string;
    init: any;

    [key: string]: any;
}

function parseSolutionName(name: string) {
    return (name.startsWith('@bfun/') && !name.startsWith('@bfun/solution-'))
        ? `@bfun/solution-${name.slice(6)}` : name;
}

export async function loadSolutions(framework: string, solutions: (string | Solution)[], parent?: ISolution[]) {
    let allSolutions = parent || [];

    for (const item of solutions) {
        let config = typeof item === 'string' ? { name: item } : item;

        if (typeof config !== 'object') continue;
        config.name = parseSolutionName(config.name);

        const { name, ...options } = config;
        if (allSolutions.findIndex(v => v.name === name) >= 0) continue;

        const configuration = await installAndRequire(name);
        if (typeof configuration === 'object') {
            let { extensions, required } = configuration;
            if (!parent && required instanceof Array) {
                if (required.indexOf(framework) < 0) continue;
            }
            if (typeof extensions === 'string') extensions = [ extensions ];
            if (extensions instanceof Array) {
                extensions = extensions.filter(extension => typeof extension === 'string');
                if (extensions.length > 0) allSolutions = await loadSolutions(framework, extensions, allSolutions);
            }
            allSolutions.push({ ...configuration, options, name });
        } else {
            logger.error('solution configuration should be an object :', name);
            process.exit(-1);
        }
    }

    return allSolutions;
}

function initFn(name: string, fn: any, options: object, type: string = 'init') {
    return async (ctx: any, next: any) => {
        const { skip } = ctx.solution;
        if (skip.indexOf(`${name}:*`) >= 0 || skip.indexOf(`${name}:${type}`) >= 0) await next();
        else await fn(ctx, next, options);
    };
}

export async function execSolutions(ctx: BContext, next: any, command: string) {
    const { bConfig } = ctx;
    const { framework, solutions = [] } = bConfig;

    ctx.solution = { skip: [], options: {} };
    const bfunSolutions = await loadSolutions(framework, solutions);
    if (bfunSolutions.length < 1) {
        logger.error(framework, 'not supported');
        return;
    }

    const initial = new Middleware();
    const handler = new Middleware();
    let solutionOptions = {};
    let preCmd = toCamel(`pre_${command}`);
    bfunSolutions.map(({ name, version, options, [preCmd]: init, [command]: exec }: ISolution) => {
        logger.green(name, ':', version);
        if (typeof init === 'function') initial.use(initFn(name, init, options));
        if (typeof exec === 'function') handler.use(initFn(name, exec, options, command));
        if (typeof options === 'object') solutionOptions = Object.assign(solutionOptions, options);
    });
    ctx.solution.options = solutionOptions;

    await next();

    await initial.run(ctx);
    await handler.run(ctx);
}

export async function execAll(ctx: BContext, next: any) {
    await execSolutions(ctx, next, ctx.name);
}

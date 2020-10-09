const path = require('path');
const md5 = require('md5');
const fs = require('fs');
const { FileSystem } = require('@bfun/utils');

const command = 'use';

async function pre(ctx, next) {
    const { opts } = ctx;
    const { filter } = opts;
    const { getLoaders } = global.common;
    ctx.loaders = await getLoaders();

    ctx.filters = filter ? filter.split(',') : [];
    await next();
}

async function run(ctx, next) {
    const { args, opts } = ctx;

    await next();

    if (args.length < 1 || !args[0]) return showAllLoaders(ctx.loaders);
    opts.remove ? await delLoader() : await addLoader(ctx, args[0]);

    const { setLoaders } = global.common;
    await setLoaders(ctx.loaders);
}

function showAllLoaders(loaders) {
    loaders.map(loader => {
        console.log();
        console.log((loader.args || []).filter(value => !value.startsWith('-')), ':', loader.name);
    });
    console.log();
}

async function addLoader(ctx, url) {
    if (url.startsWith('https://') || url.startsWith('http://')) {
        const { bfunDir } = global.bConfig;
        const hash = md5(url);
        const filepath = path.join(bfunDir, `loaders/${hash}.js`);
        new FileSystem.File(path.join(bfunDir, 'loaders')).createIfNotExists();
        const jsData = await global.request({ url: url });
        fs.writeFileSync(filepath, jsData);
        const index = ctx.loaders.findIndex(value => value.url === url);
        if (index >= 0) ctx.loaders.splice(index, 1);
        ctx.loaders.push({
            url,
            name: filepath,
            args: ctx.filters.length ? ['-h', '--help', ...ctx.filters] : '',
        });
    } else if (url.startsWith('bfun/')) {
        const index = ctx.loaders.findIndex(value => value.name === url);
        if (index >= 0) ctx.loaders.splice(index, 1);
        ctx.loaders.push({
            name: url,
            args: ctx.filters.length ? ['-h', '--help', ...ctx.filters] : '',
        });
    } else {
        console.error('invalid argument', url);
        process.exit(1);
    }
}

function delLoader(ctx, url) {
    const index = ctx.loaders.findIndex(value => value.name === url);
    if (index >= 0) ctx.loaders.splice(index, 1);
}

export const when = [command];

export function bfun(use) {
    use(`${command} [url]`).option('-r, --remove', 'bfun use <name> -r');
    return {
        [command]: {
            before: [pre],
            execute: [run],
        }
    };
}

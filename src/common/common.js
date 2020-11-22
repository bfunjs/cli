const fs = require('fs');
const path = require('path');
const { get, set } = require('lodash');
const WriteJson = require('write-json');

const { logger } = require('./logger');

async function readBConfig(ctx, next) {
    const { rootDir } = global;
    const { opts = {} } = ctx;
    const { config = '' } = opts;

    const filepath = config.endsWith('.js')
        ? path.join(rootDir, config)
        : path.join(rootDir, config, global.bConfig.filename);
    opts.config = filepath;
    global.configDir = path.dirname(filepath);

    ctx.filepath = filepath;
    if (!fs.existsSync(filepath)) {
        ctx.bConfig = await autoDetectConfig(ctx);
    } else {
        ctx.bConfig = require(filepath);
    }

    if (typeof ctx.bConfig !== 'object') {
        logger.error('b.config.js 配置错误，\n配置文档参见：<todo>');
        process.exit(1);
    }
    if (!ctx.bConfig.framework) ctx.bConfig.framework = 'webpack';
    process.env.DEBUG = ctx.bConfig.debug || true;

    await next();
}

function findIfExists(name) {
    try {
        const { rootDir } = global;
        return require.resolve(name, { paths: [ rootDir ] });
    } catch (e) {
        return false;
    }
}

async function autoDetectConfig(ctx) {
    const { args = [] } = ctx;
    if (args && args[0]) {
        const name = `@bfun/solution-${args[0]}`;
        try {
            const { required = [] } = require(name);
            return {
                framework: required[0] || '',
                solutions: [ name ],
            };
        } catch (e) {
            logger.error(`require solution<${name}> failed`);
            logger.error(e);
            process.exit(1);
        }
    }

    logger.error('未找到 b.config.js 配置，将使用默认配置');
    logger.error('配置文档参见：<todo>');

    if (findIfExists('webpack')) {
        return global.bConfig.defaultBConfig;
    } else if (findIfExists('rollup')) {
        return {
            framework: 'rollup',
            solutions: [ '@bfun/solution-rollup2' ],
        };
    }
    return global.bConfig.defaultBConfig;
}

function autoDetectJsEntry(target, options = {}) {
    const { main = 'main' } = options;
    let entry = (typeof target === 'object' && Object.keys(target).length < 1) ? undefined : target;
    if (!entry || typeof entry === 'string') {
        if (typeof entry === 'string') {
            if (fs.existsSync(entry)) return { [main]: entry };
        }

        const parent = global.configDir || process.cwd();
        const filename = entry || 'index.ts';
        const filepath = [
            path.join(parent, filename),
            path.join(parent, 'src', filename),
            path.join(parent, 'index.ts'),
            path.join(parent, 'src', 'index.ts'),
            path.join(parent, 'index.js'),
            path.join(parent, 'src', 'index.js'),
        ].find(filepath => fs.existsSync(filepath));

        return { [main]: filepath || path.join(parent, filename) };
    }
    return entry;
}

function getBfunConfig() {
    const { bfunDir, bfunCfg } = global.bConfig;
    const filepath = path.join(bfunDir, bfunCfg);
    try {
        const content = fs.readFileSync(filepath);
        if (!content) return {};
        return JSON.parse(content);
    } catch (e) {
        return {};
    }
}

async function getValue(key, def) {
    const data = getBfunConfig();
    return get(data, key, def);
}

async function setValue(key, value) {
    const data = getBfunConfig();
    set(data, key, value);
    const { bfunDir, bfunCfg } = global.bConfig;
    const filepath = path.join(bfunDir, bfunCfg);
    WriteJson.sync(filepath, data);
}

async function getLoaders() {
    const loaders = [
        { name: 'bfun/login' },
        { name: 'bfun/use' },
        { name: 'bfun/core' },
        { name: 'bfun/init' },
        { name: 'bfun/page' },
        { name: 'bfun/dev' },
        { name: 'bfun/build' },
        { name: 'bfun/deploy' },
        { name: 'bfun/publish', args: [ '-h', '--help', 'publish' ] },
    ];
    const value = await getValue('loaders', loaders);
    if (value instanceof Array && value.length) return value;
    return loaders;
}

async function setLoaders(loaders) {
    await setValue('loaders', loaders);
}

module.exports = {
    readBConfig,
    autoDetectJsEntry,
    getValue,
    setValue,
    getLoaders,
    setLoaders,
};

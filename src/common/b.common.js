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
    process.env.DEBUG = ctx.bConfig.debug || false;

    await next();
}

function findIfExists(name) {
    try {
        const { rootDir } = global;
        return require.resolve(name, { paths: [rootDir] });
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
                solutions: [name],
            };
        } catch (e) {
            logger.error(`solution: ${name} 不存在`);
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
            solutions: ['@bfun/solution-rollup2'],
        };
    }
    return global.bConfig.defaultBConfig;
}

function autoDetectJsEntry(v, main = 'main') {
    let entry = (typeof v === 'object' && Object.keys(v).length < 1) ? undefined : v;
    if (!entry || typeof entry === 'string') {
        if (typeof entry === 'string') {
            if (fs.existsSync(entry)) return { [main]: entry };
        }
        const filename = entry || 'index.js';
        const filepath = path.join(global.configDir || process.cwd());
        const entryJs = path.join(filepath, 'src', filename);
        if (fs.existsSync(entryJs)) {
            return { [main]: entryJs };
        } else {
            return { [main]: path.join(filepath, filename) };
        }
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
        { name: 'bfun/publish', args: ['-h', '--help', 'publish'] },
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

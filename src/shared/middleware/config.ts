import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { logger } from '../logger';
import { filename } from '../../config';

function findModuleIfExists(name: string) {
    try {
        const { rootDir } = global;
        return require.resolve(name, { paths: [ rootDir ] });
    } catch (e) {
        return false;
    }
}

async function autoDetectConfig(ctx: any) {
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
            logger.error(e);
            process.exit(1);
        }
    }

    logger.warn('未找到 b.config.js 配置文件，将使用默认配置')
        .warn('配置文档参见：<todo>').line();

    const defaultBConfig = {
        framework: 'webpack',
        solutions: [ '@bfun/solution-webpack4-standard' ],
    };

    if (findModuleIfExists('webpack')) {
        return defaultBConfig;
    } else if (findModuleIfExists('rollup')) {
        return {
            framework: 'rollup',
            solutions: [ '@bfun/solution-rollup2' ],
        };
    }
    return defaultBConfig;
}

export async function readConfig(ctx: any, next: any) {
    const { rootDir } = global;
    const { opts = {} } = ctx;

    const config = String(opts.config);
    const filepath = config.endsWith('.js')
        ? join(rootDir, config)
        : join(rootDir, config, filename);

    ctx.filepath = filepath;
    global.configDir = dirname(filepath);

    if (existsSync(filepath)) {
        ctx.bConfig = require(filepath);
    } else {
        ctx.bConfig = autoDetectConfig(ctx);
    }

    if (typeof ctx.bConfig !== 'object') {
        logger.error('b.config.js must be an Object.');
        process.exit(1);
    }

    if (!ctx.bConfig.framework) ctx.bConfig.framework = 'webpack';
    process.env.DEBUG = ctx.bConfig.debug || false;

    await next();
}

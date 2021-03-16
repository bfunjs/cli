import { resolve } from 'path';
import cp from 'child_process';
import cv from 'compare-versions';
import { logger } from './shared/logger';
import { checkCliVersion } from './shared/check';
import { Application } from './Application';

const minNodeVersion = '8.9.0';

export function initEnv() {
    const currentVersion = cp.execSync('node --version').toString().trim();
    if (cv(currentVersion, minNodeVersion) < 1) {
        logger.error(`@bfun/cli 需要 Node.js 版本在 ${minNodeVersion}+`);
        process.exit(1);
    }

    process.env.NODE_ENV = 'production';
    process.env.DEBUG = 'true';
    process.env.isLocal = 'false';

    const { name, version } = require('../package.json');
    global.name = name; // package name
    global.version = version;
    global.rootDir = process.cwd();
    global.userDir = process.env.HOME || process.env.USERPROFILE || '';

    process.on('unhandledRejection', (reason: any) => {
        if (reason) {
            if (reason instanceof Error) {
                const { message, code = 1 } = reason as any;
                logger.error(message);
                logger.error(reason);
                process.exit(code);
            } else {
                process.exit(1);
            }
        }
    });
}

export function watch() {
    const bfun = resolve(__dirname, '../bin/bfun');
    const child = cp.fork(bfun, process.argv.slice(2));
    child.on('message', data => {
        if (data === 'restart') {
            child.kill('SIGINT');
            watch();
        }
    });
    child.on('exit', code => code && process.exit(code));
}

export async function start() {
    await checkCliVersion();

    new Application().execute();
}

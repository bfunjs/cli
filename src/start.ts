import cp from 'child_process';
import cv from 'compare-versions';
import { resolve } from 'path';
import { Application } from './core/Application';
import { checkCliVersion } from './shared/check';
import { logger } from './shared/logger';

const MIN_NODE_VERSION = '8.9.0';

export function initEnv() {
    const version = process.version.slice(1);
    if (cv(version, MIN_NODE_VERSION) < 1) {
        logger.error(`Your node version ${ version } is not supported, please upgrade to ${ MIN_NODE_VERSION }.`);
        process.exit(1);
    }

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


    await checkCliVersion();

    return new Application().run();
}

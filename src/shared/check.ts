import { fetch } from '@bfun/fetch';
import cv from 'compare-versions';
import { logger } from './logger';

const { name, version } = require('../../package.json');

export async function checkCliVersion() {
    try {
        const url = `https://registry.npm.taobao.org/${name}/latest`;
        const res = await fetch({ url });
        const { version: latest = '' } = res.data;
        if (cv(version, latest) < 0) {
            logger.line();
            logger.warn(`@bfun/cli 最新版本 ${latest}，当前版本 ${version}`);
            logger.warn('执行命令 npm i @bfun/cli@latest -g 更新至最新版本');
            logger.line();
        }
    } catch (err) {
        logger.error(err);
    }
}

import axios from 'axios';
import { compareVersions } from 'compare-versions';
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';

import { logger } from './logger.js';

const pkg = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
);

export async function checkCliVersion() {
  try {
    const url = `http://registry.npm.taobao.org/${pkg.name}/latest`;
    const res = await axios({ url });
    const { version: latest = '' } = res.data;
    logger.success(`current cli version: ${pkg.version}`);
    if (compareVersions(pkg.version, latest) < 0) {
      logger.newline();
      logger.warn(`@bfun/cli 最新版本 ${latest}，当前版本 ${pkg.version}`);
      logger.warn('执行命令 npm i @bfun/cli@latest -g 更新至最新版本');
      logger.newline();
    }
  } catch (error) {
    console.error(error);
  }
}

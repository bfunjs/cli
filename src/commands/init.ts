import { Args, Command } from '@oclif/core';
import { resolve } from 'node:path';

import { logger } from '../shared/logger.js';
import {
  createPublicPath,
  isUmiProject,
  readProjectCredentials,
  updateUmiPublicPath,
} from '../shared/project.js';
import { fetchConfig } from '../shared/request.js';
import { compile } from '../shared/util.js';

export default class Init extends Command {
  static override args = {
    dir: Args.string({
      default: '.',
      description: '要初始化的项目目录，默认为当前执行命令的目录',
    }),
  };
  static override description = '获取应用配置并设置项目的 Umi publicPath';
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> ./my-project',
  ];

  public async run(): Promise<void> {
    const { args } = await this.parse(Init);
    const projectDir = resolve(args.dir);

    logger.info(`项目目录: ${projectDir}`);
    const { appId, token, version } = readProjectCredentials(projectDir);

    if (!isUmiProject(projectDir)) {
      logger.info('当前项目不是 Umi 项目，跳过配置初始化');
      return;
    }

    logger.info('正在获取应用配置 ...');
    const { sourceDir, sourceUrl } = await fetchConfig({ appId, token });

    updateUmiPublicPath(
      projectDir,
      compile(createPublicPath(sourceUrl, sourceDir), {
        appId,
        version,
      }),
    );
  }
}

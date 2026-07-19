import { Args, Command } from '@oclif/core';
import { resolve } from 'node:path';

import { logger } from '../shared/logger.js';
import {
  readProjectCredentials,
  updateUmiPublicPath,
} from '../shared/project.js';
import { fetchConfig } from '../shared/request.js';

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
    console.log(args);
    console.log();
    const projectDir = resolve(args.dir);

    logger.info(`项目目录: ${projectDir}`);
    const { appId, token } = readProjectCredentials(projectDir);

    logger.info('正在获取应用配置 ...');
    const { publicPath } = await fetchConfig({ appId, token });
    const result = updateUmiPublicPath(projectDir, publicPath);

    logger.success(`publicPath 已设置为 ${result.publicPath}`);
    logger.success(`Umi 配置已更新: ${result.configPath}`);
  }
}

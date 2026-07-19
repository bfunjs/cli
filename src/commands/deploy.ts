import { Args, Command, Flags } from '@oclif/core';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { logger } from '../shared/logger.js';
import {
  readIndexTemplate,
  readProjectCredentials,
} from '../shared/project.js';
import { fetchConfig, updateConfig } from '../shared/request.js';
import { uploadDir } from '../shared/upload.js';
import { compile } from '../shared/util.js';

/**
 * 该命令实现的功能是：
 * 1、读取指定目录下（可通过参数指定，如未指定，则默认是当前执行命令的目录）的 package.json 中的 appId、token、version 字段
 * 2、调用 fetchConfig 方法获取 sourceDir 和 provider 云存储配置
 * 3、调用 uploadDir 函数上传 --dist 指定的目录到编译后的 sourceDir
 * 4、调用 updateConfig 方法更新配置
 */
export default class Deploy extends Command {
  static override args = {
    dir: Args.string({
      default: '.',
      description: '要部署的项目目录，默认为当前执行命令的目录',
    }),
  };
  static override description = '部署项目到云端';
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> ./my-project',
    '<%= config.bin %> <%= command.id %> ./my-project --dist build',
  ];
  static override flags = {
    dist: Flags.string({
      default: 'dist',
      description: '要上传的构建产物目录，相对于项目目录，默认为 dist',
    }),
  };
  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Deploy);

    const projectDir = resolve(args.dir);
    logger.info(`项目目录: ${projectDir}`);

    // 步骤 1：读取 package.json 中的 appId、token、version
    logger.info('正在读取 package.json ...');
    const { appId, token, version } = readProjectCredentials(projectDir);
    logger.success(`读取成功 - appId: ${appId}, version: ${version}`);

    // 步骤 2：调用 fetchConfig 获取云存储配置和访问凭证
    logger.info('正在获取应用部署配置 ...');
    const {
      sourceDir,
      provider: { accessKey, bucket, provider, region, secretKey },
    } = await fetchConfig({
      appId,
      token,
    });
    logger.success(
      `配置获取成功 - provider: ${provider}, bucket: ${bucket}, region: ${region}`,
    );

    // 步骤 3：调用 uploadDir 上传构建产物到对应的云端目录
    const distDir = resolve(projectDir, flags.dist);
    if (!existsSync(distDir)) {
      logger.error(`构建产物目录不存在: ${distDir}`);
      this.error(`构建产物目录不存在: ${distDir}，请先构建项目`);
    }

    const compiledSourceDir = compile(sourceDir, { appId, version });
    logger.info(`正在上传 ${flags.dist} 目录到云端 ${compiledSourceDir}`);

    await uploadDir({
      accessKey,
      bucket,
      context: {},
      distDir,
      globals: {},
      provider,
      region,
      secretKey,
      sourceDir: compiledSourceDir,
    });
    logger.success(`上传完成 - 版本 ${version} 已部署到 ${provider}`);

    // 步骤 4：调用 updateConfig 更新配置
    logger.info('正在更新迭代配置 ...');
    const template = readIndexTemplate(distDir);
    const result = await updateConfig({
      appId,
      iterationData: {
        bucket,
        provider,
        region,
        sourceDir: compiledSourceDir,
        ...(template === undefined ? {} : { template }),
        version,
      },
      iterationName: version,
      token,
    });
    if (result.success) {
      logger.success('迭代配置更新成功');
    } else {
      logger.error('迭代配置更新失败，但构建文件已上传');
    }

    logger.newline();
    logger.success(`部署完成! appId: ${appId}, version: ${version}`);
  }
}

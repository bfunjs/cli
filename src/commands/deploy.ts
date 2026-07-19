import { Args, Command } from '@oclif/core';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { logger } from '../shared/logger.js';
import { fetchConfig, updateConfig } from '../shared/request.js';
import { uploadDir } from '../shared/upload.js';

interface IPackageInfo {
  appId: string;
  token: string;
  version: string;
}

/**
 * 该命令实现的功能是：
 * 1、读取指定目录下（可通过参数指定，如未指定，则默认是当前执行命令的目录）的 package.json 中的 appId、token、version 字段
 * 2、调用 fetchConfig 方法获取 prefix 和 provider 云存储配置
 * 3、调用 uploadDir 函数上传第 1 步中指定目录下的 dist 目录到对应的云端目录
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
  ];
  public async run(): Promise<void> {
    const { args } = await this.parse(Deploy);

    const projectDir = resolve(args.dir);
    logger.info(`项目目录: ${projectDir}`);

    // 步骤 1：读取 package.json 中的 appId、token、version
    logger.info('正在读取 package.json ...');
    const { appId, token, version } = this.readPackageJson(projectDir);
    logger.success(`读取成功 - appId: ${appId}, version: ${version}`);

    // 步骤 2：调用 fetchConfig 获取云存储配置和访问凭证
    logger.info('正在获取应用部署配置 ...');
    const {
      localDir,
      cloudDir,
      provider: { accessKey, bucket, provider, region, secretKey },
    } = await fetchConfig({
      appId,
      token,
    });
    logger.success(
      `配置获取成功 - provider: ${provider}, bucket: ${bucket}, region: ${region}`,
    );

    // 步骤 3：调用 uploadDir 上传 dist 目录到对应的云端目录
    const distDir = resolve(projectDir, localDir || 'dist');
    if (!existsSync(distDir)) {
      logger.error(`dist 目录不存在: ${distDir}`);
      this.error(`dist 目录不存在: ${distDir}，请先构建项目`);
    }

    const $cloudDir = `${cloudDir}/${appId}/${version}`.replaceAll(
      /\/\/+/g,
      '/',
    );
    logger.info(`正在上传 dist 目录到云端 ${$cloudDir}`);

    await uploadDir({
      accessKey,
      bucket,
      cloudDir: $cloudDir,
      context: {},
      globals: {},
      localDir: distDir,
      provider,
      region,
      secretKey,
    });
    logger.success(`上传完成 - 版本 ${version} 已部署到 ${provider}`);

    // 步骤 4：调用 updateConfig 更新配置
    logger.info('正在更新迭代配置 ...');
    const result = await updateConfig({
      appId,
      iterationData: {
        bucket,
        cloudDir,
        provider,
        region,
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

  /**
   * 读取指定目录下的 package.json，提取 appId、token、version
   */
  private readPackageJson(dir: string): IPackageInfo {
    const pkgPath = resolve(dir, 'package.json');
    if (!existsSync(pkgPath)) {
      logger.error(`未找到 package.json: ${pkgPath}`);
      this.error(`未找到 package.json: ${pkgPath}`);
    }

    try {
      const content = readFileSync(pkgPath, 'utf8');
      const pkg = JSON.parse(content);
      const { appId, token, version } = pkg;

      if (!appId) {
        logger.error('package.json 中缺少 appId 字段');
        this.error('package.json 中缺少 appId 字段');
      }

      if (!token) {
        logger.error('package.json 中缺少 token 字段');
        this.error('package.json 中缺少 token 字段');
      }

      if (!version) {
        logger.error('package.json 中缺少 version 字段');
        this.error('package.json 中缺少 version 字段');
      }

      return { appId, token, version };
    } catch (error: unknown) {
      if (error instanceof SyntaxError) {
        logger.error(`package.json 格式错误: ${pkgPath}`);
        this.error(`package.json 格式错误: ${pkgPath}`);
      }

      throw error;
    }
  }
}

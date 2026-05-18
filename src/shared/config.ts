import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

import { logger } from './logger.js';

export interface ICloudConfig {
  accessKey: string;
  secretKey: string;
}

export type IConfig = Record<string, ICloudConfig> & {
  accessKey?: string;
  apiUrl?: string;
  secretKey?: string;
  userId?: string;
};

export interface ILoginConfig {
  accessKey: string;
  apiUrl: string;
  secretKey: string;
}

function getBfunConfigPath(): string {
  return join(homedir(), '.bfun', 'config.json');
}

/**
 * 读取 ~/.bfun/config.json 全量配置
 */
export function readBfunConfig(): IConfig {
  const configPath = getBfunConfigPath();
  if (!existsSync(configPath)) {
    logger.error(`配置文件不存在: ${configPath}`);
    throw new Error(`配置文件不存在: ${configPath}，请先执行 bfun login`);
  }

  try {
    const content = readFileSync(configPath, 'utf8');
    return JSON.parse(content) as IConfig;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      logger.error(`配置文件格式错误: ${configPath}`);
      throw new Error(`配置文件格式错误: ${configPath}`);
    }

    throw error;
  }
}

/**
 * 写入登录配置到 ~/.bfun/config.json
 */
export function writeLoginConfig({
  accessKey,
  apiUrl,
  secretKey,
}: ILoginConfig): void {
  let config: IConfig = {};
  const configPath = getBfunConfigPath();

  if (existsSync(configPath)) {
    try {
      const content = readFileSync(configPath, 'utf8');
      config = JSON.parse(content) as IConfig;
    } catch (error: unknown) {
      if (error instanceof SyntaxError) {
        logger.error(`配置文件格式错误: ${configPath}`);
        throw new Error(`配置文件格式错误: ${configPath}`);
      }

      throw error;
    }
  }

  mkdirSync(dirname(configPath), { recursive: true });
  const restConfig = config as IConfig & {
    baseUrl?: string;
  };
  delete restConfig.baseUrl;
  delete restConfig.apiUrl;

  const nextConfig = { ...restConfig, accessKey, secretKey } as IConfig;
  if (apiUrl) {
    nextConfig.apiUrl = apiUrl;
  }

  writeFileSync(configPath, JSON.stringify(nextConfig, null, 2) + '\n', 'utf8');
}

/**
 * 读取指定平台的云端凭证配置
 * @param target 目标平台名称（如 AliYun、QiNiu）
 */
export function readCloudConfig(target: string): ICloudConfig {
  const config = readBfunConfig();

  const targetConfig = config[target] as ICloudConfig | undefined;
  if (!targetConfig) {
    logger.error(`配置文件中未找到 ${target} 的配置`);
    throw new Error(`配置文件中未找到 ${target} 的配置，请先执行 bfun login`);
  }

  const { accessKey, secretKey } = targetConfig;
  if (!accessKey || !secretKey) {
    logger.error(`配置文件中 ${target} 的 accessKey 或 secretKey 为空`);
    throw new Error(
      `配置文件中 ${target} 的 accessKey 或 secretKey 为空，请先执行 bfun login`,
    );
  }

  return { accessKey, secretKey };
}

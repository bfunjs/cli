import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

import { logger } from './logger.js';

export interface IConfig {
  accessKey?: string;
  apiUrl?: string;
  secretKey?: string;
}

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
  const configPath = getBfunConfigPath();
  mkdirSync(dirname(configPath), { recursive: true });
  const nextConfig: IConfig = { accessKey, secretKey };
  if (apiUrl) {
    nextConfig.apiUrl = apiUrl;
  }

  writeFileSync(configPath, JSON.stringify(nextConfig, null, 2) + '\n', 'utf8');
}

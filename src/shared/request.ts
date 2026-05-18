import axios from 'axios';

import { readBfunConfig } from './config.js';
import { logger } from './logger.js';

const DEFAULT_BASE_URL = 'http://127.0.0.1:7001';

interface IConfigRequest {
  appId: string;
  token: string;
}

export interface IAppConfig {
  bucket: string;
  prefix: string;
  region: string;
  target: string;
}

interface IUpdateConfigRequest {
  appId: string;
  iterationData: Record<string, unknown>;
  iterationName: string;
  token: string;
}

/**
 * 解析配置，返回 apiUrl 对应的请求地址和访问凭证
 * accessKey、secretKey 为必填项，缺失时抛出异常提示用户先登录
 */
function resolveConfig(): {
  accessKey: string;
  baseUrl: string;
  secretKey: string;
} {
  const { accessKey, apiUrl, secretKey } = readBfunConfig();
  if (!accessKey || !secretKey) {
    throw new Error(
      '未找到 accessKey 或 secretKey 配置，请先执行 bfun login 登录',
    );
  }

  return {
    accessKey,
    baseUrl: apiUrl ?? DEFAULT_BASE_URL,
    secretKey,
  };
}

/**
 * 接口通过 GET 请求，query 参数传入 appId 和 token
 * 返回格式: { code: 0, data: application }，其中 application.data 包含 bucket、prefix、region、target 等字段
 */
export async function fetchConfig({
  appId,
  token,
}: IConfigRequest): Promise<IAppConfig> {
  if (!appId || !token) throw new Error('appId and token must be provided');

  const { accessKey, baseUrl, secretKey } = resolveConfig();
  const url = `${baseUrl}/open/v1/application/data`;

  logger.info(`正在请求配置: ${url}`);

  const response = await axios.get(url, {
    headers: { ak: accessKey, sk: secretKey },
    params: { appId, token },
  });

  console.log(response);
  const { code, data, message } = response.data;
  if (code !== 0) {
    throw new Error(`获取配置失败: ${message ?? '未知错误'}`);
  }

  if (!data?.data) {
    throw new Error('获取配置失败: 返回数据中缺少 data 字段');
  }

  const { bucket, prefix, region, target } = data.data;
  if (!bucket || !prefix || !region || !target) {
    throw new Error(
      '获取配置失败: 返回数据中缺少必要字段 (bucket, prefix, region, target)',
    );
  }

  return { bucket, prefix, region, target };
}

/**
 * 更新应用迭代数据
 * 接口通过 POST 请求，body 传入 appId、token、iterationName、iterationData
 * 返回格式: { code: 0, data: result }
 */
export async function updateConfig({
  appId,
  iterationData,
  iterationName,
  token,
}: IUpdateConfigRequest): Promise<{ success: boolean }> {
  if (!appId || !token) throw new Error('appId and token must be provided');
  if (!iterationName) throw new Error('iterationName must be provided');
  if (!iterationData || typeof iterationData !== 'object')
    throw new Error('iterationData must be provided');

  const { accessKey, baseUrl, secretKey } = resolveConfig();
  const url = `${baseUrl}/open/v1/application/data`;

  logger.info(`正在更新配置: ${url}`);

  const response = await axios.post(
    url,
    {
      appId,
      iterationData,
      iterationName,
      token,
    },
    { headers: { ak: accessKey, sk: secretKey } },
  );

  const { code, message } = response.data;
  if (code !== 0) {
    logger.warn(`配置更新失败: ${message ?? '未知错误'}`);
    return { success: false };
  }

  return { success: true };
}

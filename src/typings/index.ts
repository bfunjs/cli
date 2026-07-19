/**
 * 环境枚举
 */
export enum EnvEnum {
  DEV = 'dev',
  PRE = 'pre',
  PROD = 'prod',
}

export interface IUploadConfig {
  accessKey: string;
  bucket: string;
  context: Record<string, string>;
  distDir: string;
  globals: Record<string, string[]>;
  region: string;
  secretKey: string;
  sourceDir: string;
  // 目标位置
  provider: string;
}

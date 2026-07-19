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
  cloudDir: string;
  context: Record<string, string>;
  globals: Record<string, string[]>;
  localDir: string;
  region: string;
  secretKey: string;
  // 目标位置
  provider: string;
}

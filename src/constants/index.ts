import { EnvEnum } from '../typings/index.js';

/**
 * 环境枚举选项数组
 */
export const ENV_OPTIONS: EnvEnum[] = [EnvEnum.DEV, EnvEnum.PRE, EnvEnum.PROD];

/**
 * 环境 flag 配置
 */
export const ENV_FLAG = {
  char: 'e' as const,
  default: EnvEnum.PROD,
  description: '命令行执行环境',
  options: ENV_OPTIONS,
};

import chalk from 'chalk';

/**
 * 日志工具
 * 提供带颜色的终端输出
 */
export const logger = {
  /**
   * 次要文本（灰色）
   */
  dim(message: string): string {
    return chalk.dim(message);
  },

  /**
   * 错误日志（红色）
   */
  error(message: string): void {
    console.error(chalk.red('✖'), message);
  },

  /**
   * 高亮文本（绿色）
   */
  highlight(message: string): string {
    return chalk.green(message);
  },

  /**
   * 信息日志（蓝色）
   */
  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  },

  /**
   * 链接（蓝色下划线）
   */
  link(url: string): void {
    console.log(chalk.blue.underline(url));
  },

  /**
   * 普通日志
   */
  log(message: string): void {
    console.log(message);
  },

  /**
   * 空行
   */
  newline(): void {
    console.log();
  },

  /**
   * 成功日志（绿色）
   */
  success(message: string): void {
    console.log(chalk.green('✔'), message);
  },

  /**
   * 标题（粗体）
   */
  title(message: string): void {
    console.log(chalk.bold(message));
  },

  /**
   * 警告日志（黄色）
   */
  warn(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  },
};

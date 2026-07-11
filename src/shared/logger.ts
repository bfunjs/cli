const color = (open: string, close: string, message: string): string =>
  `${open}${message}${close}`;

const colors = {
  blue: (message: string): string => color('\u001B[34m', '\u001B[39m', message),
  bold: (message: string): string => color('\u001B[1m', '\u001B[22m', message),
  dim: (message: string): string => color('\u001B[2m', '\u001B[22m', message),
  green: (message: string): string =>
    color('\u001B[32m', '\u001B[39m', message),
  red: (message: string): string => color('\u001B[31m', '\u001B[39m', message),
  underlineBlue: (message: string): string =>
    color('\u001B[34;4m', '\u001B[24;39m', message),
  yellow: (message: string): string =>
    color('\u001B[33m', '\u001B[39m', message),
};

/**
 * 日志工具
 * 提供带颜色的终端输出
 */
export const logger = {
  /**
   * 次要文本（灰色）
   */
  dim(message: string): string {
    return colors.dim(message);
  },

  /**
   * 错误日志（红色）
   */
  error(message: string): void {
    console.error(colors.red('✖'), message);
  },

  /**
   * 高亮文本（绿色）
   */
  highlight(message: string): string {
    return colors.green(message);
  },

  /**
   * 信息日志（蓝色）
   */
  info(message: string): void {
    console.log(colors.blue('ℹ'), message);
  },

  /**
   * 链接（蓝色下划线）
   */
  link(url: string): void {
    console.log(colors.underlineBlue(url));
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
    console.log(colors.green('✔'), message);
  },

  /**
   * 标题（粗体）
   */
  title(message: string): void {
    console.log(colors.bold(message));
  },

  /**
   * 警告日志（黄色）
   */
  warn(message: string): void {
    console.log(colors.yellow('⚠'), message);
  },
};

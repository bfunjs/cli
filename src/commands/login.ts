import readline from 'node:readline';

import { BaseCommand } from '../extend/command.js';
import { writeLoginConfig } from '../shared/config.js';
import { logger } from '../shared/logger.js';

type ReadlineInterface = readline.Interface;
type ReadlineIterator = AsyncIterableIterator<string>;

export default class Login extends BaseCommand<typeof Login> {
  static override description = '保存 bfun 登录配置';
  static override examples = ['<%= config.bin %> <%= command.id %>'];

  public async run(): Promise<void> {
    await this.parse(Login);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      const lineIterator = rl[Symbol.asyncIterator]();
      const accessKey = await this.promptRequired(
        rl,
        lineIterator,
        'accessKey',
      );
      const secretKey = await this.promptRequired(
        rl,
        lineIterator,
        'secretKey',
      );
      const apiUrl = await this.promptInput(rl, lineIterator, '请输入 apiUrl');

      writeLoginConfig({ accessKey, apiUrl, secretKey });
      logger.success('登录配置已保存');
    } finally {
      rl.close();
    }
  }

  private async promptInput(
    rl: ReadlineInterface,
    lineIterator: ReadlineIterator,
    question: string,
  ): Promise<string> {
    rl.setPrompt(`${question}: `);
    rl.prompt();

    const { done, value } = await lineIterator.next();
    return done ? '' : value.trim();
  }

  private async promptRequired(
    rl: ReadlineInterface,
    lineIterator: ReadlineIterator,
    fieldName: string,
  ): Promise<string> {
    const value = await this.promptInput(rl, lineIterator, `请输入 ${fieldName}`);
    if (!value) {
      this.error(`${fieldName} 不能为空`);
    }

    return value;
  }
}

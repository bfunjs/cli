import { Args, Command } from '@oclif/core';
import { resolve } from 'node:path';
import readline from 'node:readline';

import { logger } from '../shared/logger.js';
import {
  bumpVersion,
  readPackageVersion,
  updatePackageVersion,
} from '../shared/semver.js';

interface IVersionOption {
  description: string;
  label: string;
  value: string;
}

export default class Semver extends Command {
  static override args = {
    dir: Args.string({
      default: '.',
      description: '需要更新版本号的项目目录，默认为当前执行命令的目录',
    }),
  };
  static override description = '按照 SemVer 规范更新 package.json 中的版本号';
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> ./my-project',
  ];

  public async run(): Promise<void> {
    const { args } = await this.parse(Semver);
    const projectDir = resolve(args.dir);

    logger.info(`项目目录: ${projectDir}`);

    let currentVersion: string;
    try {
      currentVersion = readPackageVersion(projectDir);
    } catch (error: unknown) {
      this.error(error instanceof Error ? error.message : String(error));
    }

    logger.info(`当前版本: ${currentVersion}`);

    let newVersion: string;
    try {
      newVersion = await this.promptNewVersion(currentVersion);
      updatePackageVersion(projectDir, newVersion);
    } catch (error: unknown) {
      this.error(error instanceof Error ? error.message : String(error));
    }

    logger.success(`版本号已更新: ${currentVersion} → ${newVersion}`);
  }

  private getNextVersionSelectionIndex(
    currentIndex: number,
    direction: 'down' | 'up',
    optionCount: number,
  ): number {
    if (direction === 'down') {
      return (currentIndex + 1) % optionCount;
    }

    return (currentIndex - 1 + optionCount) % optionCount;
  }

  private promptInput(question: string, defaultValue: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise(resolve => {
      rl.question(`${question} [${defaultValue}]: `, answer => {
        rl.close();
        resolve(answer.trim() || defaultValue);
      });
    });
  }

  private async promptNewVersion(currentVersion: string): Promise<string> {
    const options: IVersionOption[] = [
      {
        description: '修复 bug，向后兼容',
        label: 'patch',
        value: bumpVersion(currentVersion, 'patch'),
      },
      {
        description: '新增功能，向后兼容',
        label: 'minor',
        value: bumpVersion(currentVersion, 'minor'),
      },
      {
        description: '破坏性变更，不向后兼容',
        label: 'major',
        value: bumpVersion(currentVersion, 'major'),
      },
    ];

    logger.newline();
    logger.title('请选择新的版本号（根据 SemVer 规范）:');

    if (process.stdin.isTTY && process.stdout.isTTY) {
      return this.promptVersionSelection(currentVersion, options);
    }

    for (const [index, option] of options.entries()) {
      logger.log(
        `  ${index + 1}) ${option.label}:  ${currentVersion} → ${logger.highlight(option.value)}  （${option.description}）`,
      );
    }

    logger.newline();
    const answer = await this.promptInput('请输入选项 (1/2/3)', '1');
    const selected = options[Number(answer) - 1]?.value;
    if (!selected) {
      throw new Error(`无效选项: ${answer}，请输入 1、2 或 3`);
    }

    return selected;
  }

  private promptVersionSelection(
    currentVersion: string,
    options: IVersionOption[],
  ): Promise<string> {
    let selectedIndex = 0;
    let rendered = false;
    const input = process.stdin;
    const output = process.stdout;
    const hadRawMode = input.isRaw;

    readline.emitKeypressEvents(input);
    input.setRawMode(true);
    input.resume();

    const render = () => {
      if (rendered) {
        readline.moveCursor(output, 0, -options.length);
      }

      for (const [index, option] of options.entries()) {
        readline.clearLine(output, 0);
        readline.cursorTo(output, 0);

        const marker = index === selectedIndex ? logger.highlight('›') : ' ';
        const shortcut = `${index + 1})`;
        output.write(
          `${marker} ${shortcut} ${option.label}:  ${currentVersion} → ${logger.highlight(option.value)}  （${option.description}）\n`,
        );
      }

      rendered = true;
    };

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        input.off('keypress', onKeypress);
        input.setRawMode(hadRawMode);
        input.pause();
        output.write('\n');
      };

      const onKeypress = (character: string, key: readline.Key) => {
        if (key.ctrl && key.name === 'c') {
          cleanup();
          reject(new Error('已取消'));
          return;
        }

        if (key.name === 'down' || key.name === 'up') {
          selectedIndex = this.getNextVersionSelectionIndex(
            selectedIndex,
            key.name,
            options.length,
          );
          render();
          return;
        }

        if (key.name === 'return' || key.name === 'enter') {
          cleanup();
          resolve(options[selectedIndex].value);
          return;
        }

        const numericIndex = Number(character) - 1;
        if (Number.isInteger(numericIndex) && options[numericIndex]) {
          selectedIndex = numericIndex;
          cleanup();
          resolve(options[selectedIndex].value);
        }
      };

      input.on('keypress', onKeypress);
      render();
    });
  }
}

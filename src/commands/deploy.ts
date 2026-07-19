import { Args, Command, Flags } from '@oclif/core';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import readline from 'node:readline';

import { logger } from '../shared/logger.js';
import { fetchConfig, updateConfig } from '../shared/request.js';
import { uploadDir } from '../shared/upload.js';

interface IPackageInfo {
  appId: string;
  token: string;
  version: string;
}

interface IVersionOption {
  description: string;
  label: string;
  value: string;
}

/**
 * 该命令实现的功能是：
 * 1、读取指定目录下（可通过参数指定，如未指定，则默认是当前执行命令的目录）的 package.json 中的 appId、token、version 字段
 * 1.1 让用户根据SemVer规范选择一个新的版本号
 * 2、调用 fetchConfig 方法获取 prefix 和 provider 云存储配置
 * 3、调用 uploadDir 函数上传第 1 步中指定目录下的 dist 目录到对应的云端目录
 * 4、调用 updateConfig 方法更新配置
 * 4.1 上传成功后，将新的版本号更新到读取时的 package.json 中
 */
export default class Deploy extends Command {
  static override args = {
    dir: Args.string({
      default: '.',
      description: '要部署的项目目录，默认为当前执行命令的目录',
    }),
  };
  static override description = '部署项目到云端';
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> ./my-project',
  ];
  static override flags = {
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: 'f', description: '强制部署，不检查版本' }),
  };

  public async run(): Promise<void> {
    const { args } = await this.parse(Deploy);

    const projectDir = resolve(args.dir);
    logger.info(`项目目录: ${projectDir}`);

    // 步骤 1：读取 package.json 中的 appId、token、version
    logger.info('正在读取 package.json ...');
    const { appId, token, version } = this.readPackageJson(projectDir);
    logger.success(`读取成功 - appId: ${appId}, version: ${version}`);

    // 步骤 1.1：让用户根据 SemVer 规范选择一个新的版本号
    logger.info('当前版本: ' + version);
    const newVersion = await this.promptNewVersion(version);
    logger.success(`最新部署版本: ${newVersion}`);

    // 步骤 2：调用 fetchConfig 获取云存储配置和访问凭证
    logger.info('正在获取应用部署配置 ...');
    const {
      localDir,
      cloudDir,
      publicPath,
      provider: { accessKey, bucket, provider, region, secretKey },
    } = await fetchConfig({
      appId,
      token,
    });
    logger.success(
      `配置获取成功 - provider: ${provider}, bucket: ${bucket}, region: ${region}`,
    );

    // 步骤 3：调用 uploadDir 上传 dist 目录到对应的云端目录
    const distDir = resolve(projectDir, localDir || 'dist');
    if (!existsSync(distDir)) {
      logger.error(`dist 目录不存在: ${distDir}`);
      this.error(`dist 目录不存在: ${distDir}，请先构建项目`);
    }

    const $cloudDir = `${cloudDir}/${appId}/${newVersion}`.replaceAll(
      /\/\/+/g,
      '/',
    );
    logger.info(`正在上传 dist 目录到云端 ${$cloudDir} ...`);

    await uploadDir({
      accessKey,
      bucket,
      cloudDir: $cloudDir,
      context: {},
      globals: {},
      localDir: distDir,
      provider,
      region,
      secretKey,
    });
    logger.success(`上传完成 - 版本 ${newVersion} 已部署到 ${provider}`);

    // 步骤 4：调用 updateConfig 更新配置
    logger.info('正在更新迭代配置 ...');
    const result = await updateConfig({
      appId,
      iterationData: {
        bucket,
        cloudDir,
        provider,
        region,
        version: newVersion,
      },
      iterationName: newVersion,
      token,
    });
    if (result.success) {
      logger.success('迭代配置更新成功');
    } else {
      logger.error('迭代配置更新失败，但构建文件已上传');
    }

    // 步骤 4.1：上传成功后，将新的版本号更新到读取时的 package.json 中
    this.updatePackageVersion(projectDir, newVersion);

    logger.newline();
    logger.success(`部署完成! appId: ${appId}, version: ${newVersion}`);
  }

  /**
   * 根据 SemVer 规范递增版本号
   * @param version 当前版本号（格式: x.y.z）
   * @param release 递增类型：major | minor | patch
   */
  private bumpVersion(
    version: string,
    release: 'major' | 'minor' | 'patch',
  ): string {
    const parts = version.split('.');
    if (parts.length !== 3) {
      logger.error(`版本号格式错误: ${version}，应为 x.y.z`);
      this.error(`版本号格式错误: ${version}，应为 x.y.z`);
    }

    const [majorStr, minorStr, patchStr] = parts;
    let major = Number(majorStr);
    let minor = Number(minorStr);
    let patch = Number(patchStr);

    if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
      logger.error(`版本号格式错误: ${version}，各段必须为数字`);
      this.error(`版本号格式错误: ${version}，各段必须为数字`);
    }

    switch (release) {
      case 'major': {
        major += 1;
        minor = 0;
        patch = 0;
        break;
      }

      case 'minor': {
        minor += 1;
        patch = 0;
        break;
      }

      case 'patch': {
        patch += 1;
        break;
      }
    }

    return `${major}.${minor}.${patch}`;
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

  /**
   * 从终端读取用户输入
   * @param question 提示文本
   * @param defaultValue 默认值
   */
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

  /**
   * 交互式让用户选择新版本号
   * 展示 patch / minor / major 三种递增选项，支持上下键选择或输入数字
   * @param currentVersion 当前版本号
   */
  private async promptNewVersion(currentVersion: string): Promise<string> {
    const patchVersion = this.bumpVersion(currentVersion, 'patch');
    const minorVersion = this.bumpVersion(currentVersion, 'minor');
    const majorVersion = this.bumpVersion(currentVersion, 'major');
    const options: IVersionOption[] = [
      {
        description: '修复 bug，向后兼容',
        label: 'patch',
        value: patchVersion,
      },
      {
        description: '新增功能，向后兼容',
        label: 'minor',
        value: minorVersion,
      },
      {
        description: '破坏性变更，不向后兼容',
        label: 'major',
        value: majorVersion,
      },
    ];

    console.log('');
    logger.title('请选择新的版本号（根据 SemVer 规范）:');

    if (process.stdin.isTTY && process.stdout.isTTY) {
      return this.promptVersionSelection(currentVersion, options);
    }

    for (const [index, option] of options.entries()) {
      console.log(
        `  ${index + 1}) ${option.label}:  ${currentVersion} → ${logger.highlight(option.value)}  （${option.description}）`,
      );
    }

    console.log('');

    const answer = await this.promptInput('请输入选项 (1/2/3)', '1');

    const selected = options[Number(answer.trim()) - 1]?.value;
    if (!selected) {
      logger.error(`无效选项: ${answer}，请输入 1、2 或 3`);
      this.error(`无效选项: ${answer}，请输入 1、2 或 3`);
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
        const line = `${marker} ${shortcut} ${option.label}:  ${currentVersion} → ${logger.highlight(option.value)}  （${option.description}）`;
        output.write(`${line}\n`);
      }

      rendered = true;
    };

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        input.off('keypress', onKeypress);
        input.setRawMode(hadRawMode);
        output.write('\n');
      };

      const onKeypress = (character: string, key: readline.Key) => {
        if (key.ctrl && key.name === 'c') {
          cleanup();
          reject(new Error('已取消'));
          return;
        }

        if (key.name === 'down') {
          selectedIndex = this.getNextVersionSelectionIndex(
            selectedIndex,
            'down',
            options.length,
          );
          render();
          return;
        }

        if (key.name === 'up') {
          selectedIndex = this.getNextVersionSelectionIndex(
            selectedIndex,
            'up',
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

  /**
   * 读取指定目录下的 package.json，提取 appId、token、version
   */
  private readPackageJson(dir: string): IPackageInfo {
    const pkgPath = resolve(dir, 'package.json');
    if (!existsSync(pkgPath)) {
      logger.error(`未找到 package.json: ${pkgPath}`);
      this.error(`未找到 package.json: ${pkgPath}`);
    }

    try {
      const content = readFileSync(pkgPath, 'utf8');
      const pkg = JSON.parse(content);
      const { appId, token, version } = pkg;

      if (!appId) {
        logger.error('package.json 中缺少 appId 字段');
        this.error('package.json 中缺少 appId 字段');
      }

      if (!token) {
        logger.error('package.json 中缺少 token 字段');
        this.error('package.json 中缺少 token 字段');
      }

      if (!version) {
        logger.error('package.json 中缺少 version 字段');
        this.error('package.json 中缺少 version 字段');
      }

      return { appId, token, version };
    } catch (error: unknown) {
      if (error instanceof SyntaxError) {
        logger.error(`package.json 格式错误: ${pkgPath}`);
        this.error(`package.json 格式错误: ${pkgPath}`);
      }

      throw error;
    }
  }

  /**
   * 将新的版本号更新到 package.json 中
   * @param dir 项目目录
   * @param newVersion 新版本号
   */
  private updatePackageVersion(dir: string, newVersion: string): void {
    const pkgPath = resolve(dir, 'package.json');

    try {
      const content = readFileSync(pkgPath, 'utf8');
      const pkg = JSON.parse(content);
      const oldVersion = pkg.version;
      pkg.version = newVersion;

      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
      logger.success(`版本号已更新: ${oldVersion} → ${newVersion}`);
    } catch (error: unknown) {
      logger.error(
        `版本号写回失败: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
}

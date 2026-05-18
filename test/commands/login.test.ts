import { runCommand } from '@oclif/test';
import { expect } from 'chai';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';

describe('login', () => {
  const originalHome = process.env.HOME;
  const stdinDescriptor = Object.getOwnPropertyDescriptor(process, 'stdin');
  let homeDir: string;

  beforeEach(async () => {
    homeDir = await mkdtemp(join(tmpdir(), 'bfun-login-'));
    process.env.HOME = homeDir;
  });

  afterEach(() => {
    if (stdinDescriptor) {
      Object.defineProperty(process, 'stdin', stdinDescriptor);
    }

    if (originalHome === undefined) {
      delete process.env.HOME;
    } else {
      process.env.HOME = originalHome;
    }

    rmSync(homeDir, { force: true, recursive: true });
  });

  it('saves login config from interactive prompts', async () => {
    Object.defineProperty(process, 'stdin', {
      configurable: true,
      value: Readable.from(['test-ak\n', 'test-sk\n', 'https://api.example.com\n']),
    });

    const { stdout } = await runCommand('login');

    expect(stdout).to.contain('请输入 accessKey');
    expect(stdout).to.contain('请输入 secretKey');
    expect(stdout).to.contain('请输入 apiUrl');
    expect(stdout).to.contain('登录配置已保存');

    const configPath = join(homeDir, '.bfun', 'config.json');
    expect(existsSync(configPath)).to.equal(true);

    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    expect(config).to.deep.equal({
      accessKey: 'test-ak',
      apiUrl: 'https://api.example.com',
      secretKey: 'test-sk',
    });
  });
});

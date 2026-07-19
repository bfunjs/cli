import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const homedirMock = vi.hoisted(() => vi.fn());

vi.mock('node:os', async importOriginal => ({
  ...(await importOriginal<typeof import('node:os')>()),
  homedir: homedirMock,
}));

const loggerMock = vi.hoisted(() => ({
  error: vi.fn(),
}));

vi.mock('../../src/shared/logger.js', () => ({
  logger: loggerMock,
}));

const { readBfunConfig, writeLoginConfig } =
  await import('../../src/shared/config.js');

describe('config', () => {
  let homeDir: string;
  let configPath: string;

  beforeEach(() => {
    homeDir = join(
      tmpdir(),
      `bfun-cli-config-test-${process.pid}-${Date.now()}`,
    );
    configPath = join(homeDir, '.bfun', 'config.json');
    homedirMock.mockReturnValue(homeDir);
    loggerMock.error.mockClear();
  });

  afterEach(() => {
    rmSync(homeDir, { force: true, recursive: true });
  });

  it('throws when config file does not exist', () => {
    expect(() => readBfunConfig()).toThrow('请先执行 bfun login');
    expect(loggerMock.error).toHaveBeenCalledWith(
      `配置文件不存在: ${configPath}`,
    );
  });

  it('writes only login config and removes legacy cloud config', () => {
    mkdirSync(join(homeDir, '.bfun'), { recursive: true });
    writeFileSync(
      configPath,
      JSON.stringify({
        AliYun: { accessKey: 'ak1', secretKey: 'sk1' },
        apiUrl: 'https://old.example.com',
        baseUrl: 'https://legacy.example.com',
      }),
      'utf8',
    );

    writeLoginConfig({
      accessKey: 'login-ak',
      apiUrl: '',
      secretKey: 'login-sk',
    });

    expect(JSON.parse(readFileSync(configPath, 'utf8'))).toEqual({
      accessKey: 'login-ak',
      secretKey: 'login-sk',
    });
  });
});

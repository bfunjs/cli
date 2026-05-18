import { expect } from 'chai';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('config', () => {
  const originalHome = process.env.HOME;
  let homeDir: string;

  beforeEach(() => {
    homeDir = mkdtempSync(join(tmpdir(), 'bfun-config-'));
    process.env.HOME = homeDir;
  });

  afterEach(() => {
    if (originalHome === undefined) {
      delete process.env.HOME;
    } else {
      process.env.HOME = originalHome;
    }

    rmSync(homeDir, { force: true, recursive: true });
  });

  it('saves login config to ~/.bfun/config.json', async () => {
    const configPath = join(homeDir, '.bfun', 'config.json');
    mkdirSync(join(homeDir, '.bfun'), { recursive: true });
    writeFileSync(
      configPath,
      JSON.stringify({
        baseUrl: 'https://old.example.com',
        userId: 'user-id',
      }),
      'utf8',
    );

    const { writeLoginConfig } = await import('../../src/shared/config.js');

    writeLoginConfig({
      accessKey: 'test-ak',
      apiUrl: 'https://api.example.com',
      secretKey: 'test-sk',
    });

    expect(existsSync(configPath)).to.equal(true);

    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    expect(config).to.deep.include({
      accessKey: 'test-ak',
      apiUrl: 'https://api.example.com',
      secretKey: 'test-sk',
    });
    expect(config.userId).to.equal('user-id');
    expect(config).to.not.have.property('baseUrl');
  });

  it('removes apiUrl when login config receives an empty apiUrl', async () => {
    const configPath = join(homeDir, '.bfun', 'config.json');
    mkdirSync(join(homeDir, '.bfun'), { recursive: true });
    writeFileSync(
      configPath,
      JSON.stringify({
        apiUrl: 'https://old-api.example.com',
        baseUrl: 'https://old-base.example.com',
        userId: 'user-id',
      }),
      'utf8',
    );

    const { writeLoginConfig } = await import('../../src/shared/config.js');

    writeLoginConfig({
      accessKey: 'test-ak',
      apiUrl: '',
      secretKey: 'test-sk',
    });

    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    expect(config).to.deep.include({
      accessKey: 'test-ak',
      secretKey: 'test-sk',
      userId: 'user-id',
    });
    expect(config).to.not.have.property('apiUrl');
    expect(config).to.not.have.property('baseUrl');
  });
});

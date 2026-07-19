import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  normalizePublicPath,
  readProjectCredentials,
  updateUmiPublicPath,
} from '../../src/shared/project.js';

describe('project config', () => {
  let projectDir: string;

  beforeEach(() => {
    projectDir = join(
      tmpdir(),
      `bfun-cli-project-test-${process.pid}-${Date.now()}`,
    );
    mkdirSync(projectDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(projectDir, { force: true, recursive: true });
  });

  it('reads app credentials from package.json', () => {
    writeFileSync(
      join(projectDir, 'package.json'),
      JSON.stringify({ appId: ' A1 ', token: ' token ' }),
      'utf8',
    );

    expect(readProjectCredentials(projectDir)).toEqual({
      appId: 'A1',
      token: 'token',
    });
  });

  it('normalizes publicPath with one trailing slash', () => {
    expect(normalizePublicPath('https://cdn.example.com/app///')).toBe(
      'https://cdn.example.com/app/',
    );
  });

  it('updates an existing publicPath and preserves the quote style', () => {
    const configPath = join(projectDir, '.umirc.ts');
    writeFileSync(
      configPath,
      "export default defineConfig({\n  publicPath: '/old/',\n});\n",
      'utf8',
    );

    expect(
      updateUmiPublicPath(projectDir, 'https://cdn.example.com/app'),
    ).toEqual({
      configPath,
      publicPath: 'https://cdn.example.com/app/',
    });
    expect(readFileSync(configPath, 'utf8')).toContain(
      "publicPath: 'https://cdn.example.com/app/',",
    );
  });

  it('refuses to rewrite a config without an explicit publicPath', () => {
    writeFileSync(
      join(projectDir, '.umirc.ts'),
      'export default defineConfig({});\n',
      'utf8',
    );

    expect(() => updateUmiPublicPath(projectDir, '/app/')).toThrow(
      '请先添加 publicPath',
    );
  });
});

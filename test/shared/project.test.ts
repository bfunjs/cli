import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  createPublicPath,
  isUmiProject,
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

  function writePackageJson(value: Record<string, unknown>): void {
    writeFileSync(
      join(projectDir, 'package.json'),
      JSON.stringify(value),
      'utf8',
    );
  }

  function writeUmiPackageJson(): void {
    writePackageJson({ devDependencies: { umi: '^4.0.0' } });
  }

  it('reads app credentials from package.json', () => {
    writePackageJson({
      appId: ' A1 ',
      token: ' token ',
      version: ' 1.2.3 ',
    });

    expect(readProjectCredentials(projectDir)).toEqual({
      appId: 'A1',
      token: 'token',
      version: '1.2.3',
    });
  });

  it('reports a missing version field', () => {
    writePackageJson({ appId: 'A1', token: 'token' });

    expect(() => readProjectCredentials(projectDir)).toThrow(
      'package.json 中缺少 version 字段',
    );
  });

  it('normalizes publicPath with one trailing slash', () => {
    expect(normalizePublicPath('https://cdn.example.com/app///')).toBe(
      'https://cdn.example.com/app/',
    );
  });

  it('creates publicPath from sourceUrl and sourceDir', () => {
    expect(
      createPublicPath('https://cdn.example.com///', '/app/A1/1.2.3/'),
    ).toBe('https://cdn.example.com/app/A1/1.2.3/');
    expect(createPublicPath('//cdn.example.com', 'assets')).toBe(
      '//cdn.example.com/assets/',
    );
  });

  it('rejects an empty sourceUrl or sourceDir', () => {
    expect(() => createPublicPath('', '/app/')).toThrow(
      'sourceUrl 或 sourceDir 为空',
    );
  });

  it('recognizes Umi and Umi Max projects from package dependencies', () => {
    writePackageJson({ dependencies: { '@umijs/max': '^4.0.0' } });

    expect(isUmiProject(projectDir)).toBe(true);
  });

  it('refuses to update a non-Umi project', () => {
    writePackageJson({ dependencies: { react: '^19.0.0' } });
    writeFileSync(
      join(projectDir, '.umirc.ts'),
      "export default { publicPath: '/old/' };\n",
      'utf8',
    );

    expect(updateUmiPublicPath(projectDir, '/app/')).toBe(false);
  });

  it('refuses to update when publicPath is empty', () => {
    writeUmiPackageJson();

    expect(updateUmiPublicPath(projectDir, '   ')).toBe(false);
  });

  it('updates an existing publicPath and preserves the quote style', () => {
    writeUmiPackageJson();
    const configPath = join(projectDir, '.umirc.ts');
    writeFileSync(
      configPath,
      "export default defineConfig({\n  publicPath: '/old/',\n});\n",
      'utf8',
    );

    expect(updateUmiPublicPath(projectDir, 'https://cdn.example.com/app')).toBe(
      true,
    );
    expect(readFileSync(configPath, 'utf8')).toContain(
      "publicPath: 'https://cdn.example.com/app/',",
    );
  });

  it('refuses to rewrite a config without an explicit publicPath', () => {
    writeUmiPackageJson();
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

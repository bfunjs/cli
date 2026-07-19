import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  bumpVersion,
  readPackageVersion,
  updatePackageVersion,
} from '../../src/shared/semver.js';

describe('semver', () => {
  let projectDir: string;

  beforeEach(() => {
    projectDir = join(
      tmpdir(),
      `bfun-cli-semver-test-${process.pid}-${Date.now()}`,
    );
    mkdirSync(projectDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(projectDir, { force: true, recursive: true });
  });

  it.each([
    ['patch', '1.2.4'],
    ['minor', '1.3.0'],
    ['major', '2.0.0'],
  ] as const)('increments the %s version', (release, expected) => {
    expect(bumpVersion('1.2.3', release)).toBe(expected);
  });

  it('rejects an invalid version', () => {
    expect(() => bumpVersion('1.2', 'patch')).toThrow('应为 x.y.z');
  });

  it('reads and updates package.json while preserving other fields', () => {
    const packagePath = join(projectDir, 'package.json');
    writeFileSync(
      packagePath,
      JSON.stringify({ name: 'demo', version: '1.2.3' }),
      'utf8',
    );

    expect(readPackageVersion(projectDir)).toBe('1.2.3');
    updatePackageVersion(projectDir, '1.3.0');

    expect(JSON.parse(readFileSync(packagePath, 'utf8'))).toEqual({
      name: 'demo',
      version: '1.3.0',
    });
  });

  it('reports a missing version field', () => {
    writeFileSync(join(projectDir, 'package.json'), '{}', 'utf8');

    expect(() => readPackageVersion(projectDir)).toThrow('version 字段');
  });
});

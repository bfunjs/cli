import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type ReleaseType = 'major' | 'minor' | 'patch';

const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function parseVersion(version: string): [number, number, number] {
  const match = SEMVER_PATTERN.exec(version);
  if (!match) {
    throw new Error(`版本号格式错误: ${version}，应为 x.y.z`);
  }

  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** Increment a simple x.y.z semantic version. */
export function bumpVersion(version: string, release: ReleaseType): string {
  let [major, minor, patch] = parseVersion(version);

  if (release === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (release === 'minor') {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }

  return `${major}.${minor}.${patch}`;
}

/** Read the current version from a project's package.json. */
export function readPackageVersion(projectDir: string): string {
  const packagePath = resolve(projectDir, 'package.json');
  if (!existsSync(packagePath)) {
    throw new Error(`未找到 package.json: ${packagePath}`);
  }

  let pkg: Record<string, unknown>;
  try {
    pkg = JSON.parse(readFileSync(packagePath, 'utf8')) as Record<
      string,
      unknown
    >;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(`package.json 格式错误: ${packagePath}`);
    }

    throw error;
  }

  if (typeof pkg.version !== 'string' || !pkg.version) {
    throw new Error('package.json 中缺少 version 字段');
  }

  return pkg.version;
}

/** Write a new version to a project's package.json. */
export function updatePackageVersion(
  projectDir: string,
  newVersion: string,
): void {
  // Validate before touching the file.
  parseVersion(newVersion);

  const packagePath = resolve(projectDir, 'package.json');
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8')) as Record<
    string,
    unknown
  >;
  pkg.version = newVersion;
  writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
}

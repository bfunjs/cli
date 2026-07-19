import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { logger } from './logger';

export interface IProjectCredentials {
  appId: string;
  token: string;
  version: string;
}

const UMI_CONFIG_FILES = [
  '.umirc.ts',
  '.umirc.js',
  '.umirc.mts',
  '.umirc.mjs',
  'config/config.ts',
  'config/config.js',
  'config/config.mts',
  'config/config.mjs',
];

const UMI_PACKAGES = ['umi', '@umijs/max'];

function readPackageJson(projectDir: string): Record<string, unknown> {
  const packagePath = resolve(projectDir, 'package.json');
  if (!existsSync(packagePath)) {
    throw new Error(`未找到 package.json: ${packagePath}`);
  }

  try {
    return JSON.parse(readFileSync(packagePath, 'utf8')) as Record<
      string,
      unknown
    >;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new Error(`package.json 格式错误: ${packagePath}`);
    }

    throw error;
  }
}

function hasDependency(dependencies: unknown, packageName: string): boolean {
  return (
    typeof dependencies === 'object' &&
    dependencies !== null &&
    Object.hasOwn(dependencies, packageName)
  );
}

/** Determine whether the target package uses Umi or Umi Max. */
export function isUmiProject(projectDir: string): boolean {
  const pkg = readPackageJson(projectDir);
  return UMI_PACKAGES.some(
    packageName =>
      hasDependency(pkg.dependencies, packageName) ||
      hasDependency(pkg.devDependencies, packageName),
  );
}

/**
 * Read the credentials used by the bfun OpenAPI from a project package.json.
 */
export function readProjectCredentials(
  projectDir: string,
): IProjectCredentials {
  const pkg = readPackageJson(projectDir);

  const appId = typeof pkg.appId === 'string' ? pkg.appId.trim() : '';
  const token = typeof pkg.token === 'string' ? pkg.token.trim() : '';
  const version = typeof pkg.version === 'string' ? pkg.version.trim() : '';
  if (!appId) {
    throw new Error('package.json 中缺少 appId 字段');
  }

  if (!token) {
    throw new Error('package.json 中缺少 token 字段');
  }

  if (!version) {
    throw new Error('package.json 中缺少 version 字段');
  }

  return { appId, token, version };
}

/**
 * Umi expects publicPath to end with a slash so that asset URLs concatenate
 * correctly.
 */
export function normalizePublicPath(publicPath: string): string {
  if (typeof publicPath !== 'string') {
    throw new Error('接口返回的 publicPath 为空');
  }

  const value = publicPath.trim();
  if (!value) {
    throw new Error('接口返回的 publicPath 为空');
  }

  return `${value.replace(/\/+$/, '')}/`;
}

/** Join an asset origin and directory without damaging URL protocol slashes. */
export function createPublicPath(sourceUrl: string, sourceDir: string): string {
  const url = typeof sourceUrl === 'string' ? sourceUrl.trim() : '';
  const dir = typeof sourceDir === 'string' ? sourceDir.trim() : '';
  if (!url || !dir) {
    throw new Error('接口返回的 sourceUrl 或 sourceDir 为空');
  }

  return normalizePublicPath(
    `${url.replace(/\/+$/, '')}/${dir.replace(/^\/+/, '')}`,
  );
}

function quote(value: string, quotationMark: string): string {
  const escaped = value
    .replaceAll('\\', '\\\\')
    .replaceAll(quotationMark, `\\${quotationMark}`)
    .replaceAll('\r', '\\r')
    .replaceAll('\n', '\\n');
  return `${quotationMark}${escaped}${quotationMark}`;
}

/**
 * Update an existing publicPath property in the project's Umi config.
 *
 * The command intentionally does not synthesize a new config shape. Refusing
 * to update when the property is absent avoids silently corrupting configs
 * that are composed through functions or shared objects.
 */
export function updateUmiPublicPath(
  projectDir: string,
  publicPath: string,
): boolean {
  if (typeof publicPath !== 'string' || !publicPath.trim()) {
    logger.info('接口返回的 publicPath 为空，跳过 Umi 配置更新');
    return false;
  }

  if (!isUmiProject(projectDir)) {
    logger.error(
      `当前目录不是 Umi 项目，package.json 中未找到 ${UMI_PACKAGES.join(' 或 ')} 依赖`,
    );
    return false;
  }

  const normalizedPublicPath = normalizePublicPath(publicPath);
  const configPath = UMI_CONFIG_FILES.map(file =>
    resolve(projectDir, file),
  ).find(existsSync);
  if (!configPath) {
    throw new Error(
      `未找到 Umi 配置文件，支持: ${UMI_CONFIG_FILES.join(', ')}`,
    );
  }

  const source = readFileSync(configPath, 'utf8');
  const publicPathProperty =
    /^(\s*publicPath\s*:\s*)(['"])(.*?)\2(\s*,?\s*(?:\/\/.*)?)$/m;

  if (!publicPathProperty.test(source)) {
    throw new Error(
      `未在 ${configPath} 中找到字符串形式的 publicPath 配置，请先添加 publicPath: '/'`,
    );
  }

  const nextSource = source.replace(
    publicPathProperty,
    (
      _match,
      prefix: string,
      quotationMark: string,
      _oldValue,
      suffix: string,
    ) => `${prefix}${quote(normalizedPublicPath, quotationMark)}${suffix}`,
  );
  writeFileSync(configPath, nextSource, 'utf8');

  logger.success(`publicPath 已设置为 ${normalizedPublicPath}`);
  logger.success(`Umi 配置已更新: ${configPath}`);

  return true;
}

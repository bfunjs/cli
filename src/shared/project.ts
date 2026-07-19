import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface IProjectCredentials {
  appId: string;
  token: string;
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

/**
 * Read the credentials used by the bfun OpenAPI from a project package.json.
 */
export function readProjectCredentials(
  projectDir: string,
): IProjectCredentials {
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

  const appId = typeof pkg.appId === 'string' ? pkg.appId.trim() : '';
  const token = typeof pkg.token === 'string' ? pkg.token.trim() : '';
  if (!appId) {
    throw new Error('package.json 中缺少 appId 字段');
  }

  if (!token) {
    throw new Error('package.json 中缺少 token 字段');
  }

  return { appId, token };
}

/**
 * Umi expects publicPath to end with a slash so that asset URLs concatenate
 * correctly.
 */
export function normalizePublicPath(publicPath: string): string {
  const value = publicPath.trim();
  if (!value) {
    throw new Error('接口返回的 publicPath 为空');
  }

  return `${value.replace(/\/+$/, '')}/`;
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
): { configPath: string; publicPath: string } {
  const configPath = UMI_CONFIG_FILES.map(file =>
    resolve(projectDir, file),
  ).find(existsSync);
  if (!configPath) {
    throw new Error(
      `未找到 Umi 配置文件，支持: ${UMI_CONFIG_FILES.join(', ')}`,
    );
  }

  const normalizedPublicPath = normalizePublicPath(publicPath);
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

  return { configPath, publicPath: normalizedPublicPath };
}

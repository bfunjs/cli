import { resolve, join } from 'path';
import { existsSync } from 'fs';
import md5 from 'md5';
import spawn from 'cross-spawn';

import { getValue } from '../config';
import { logger } from './logger';

export function safeRequire(name: string) {
    try {
        return require(name);
    } catch (e) {
        logger.error(e);
    }
    return undefined;
}

export async function installDependency(name: string, cwd?: string): Promise<void> {
    const command = await getValue('command', 'npm');
    const registry = await getValue('registry', 'https://registry.npm.taobao.org');
    return new Promise((resolve, reject) => {
        const args = [ 'install', name ];
        if (registry) args.push(`--registry=${registry}`);
        const child = spawn(command, args, { cwd, stdio: [ 'pipe', process.stdout, process.stderr ] });
        child.once('close', (code: number) => {
            if (code !== 0) {
                reject({ command: `${command} ${args.join(' ')}` });
                return;
            }
            resolve();
        });
        child.once('error', reject);
    });
}

export async function installAndRequire(name: string) {
    const index = name.lastIndexOf('@');
    const pluginName = index > 0 ? name.slice(index) : name;
    const { rootDir } = global;
    let pluginPath;
    try {
        pluginPath = require.resolve(pluginName, { paths: [ rootDir ] });
    } catch (e) {
        await installDependency(name, rootDir);
        const pkgPath = resolve(rootDir, 'node_modules', pluginName, 'package.json');
        const pkgJson = safeRequire(pkgPath);
        pluginPath = resolve(rootDir, 'node_modules', pluginName, pkgJson.main);
    }
    return require(pluginPath);
}

export function autoDetectJsEntry(target: any, options: any = {}) {
    const { main = 'index' } = options;
    let entry = (typeof target === 'object' && Object.keys(target).length < 1) ? undefined : target;
    if (!entry || typeof entry === 'string') {
        if (typeof entry === 'string') {
            if (existsSync(entry)) return { [main]: entry };
        }

        const parent = global.configDir || process.cwd();
        const filename = entry || 'index.ts';
        const filepath = [
            join(parent, filename),
            join(parent, 'src', filename),
            join(parent, 'index.ts'),
            join(parent, 'src', 'index.ts'),
            join(parent, 'index.js'),
            join(parent, 'src', 'index.js'),
        ].find(filepath => existsSync(filepath));

        return { [main]: filepath || join(parent, filename) };
    }
    return entry;
}

export function cleanDir(filepath: string): Promise<void> {
    const rimraf = require('rimraf');
    return new Promise((resolve, reject) => {
        try {
            rimraf(filepath, (e: any) => {
                if (e) reject(e);
                resolve();
            });
        } catch (e) {
            reject(e);
        }
    });
}

export function compile(tmpl: string, data: any = {}) {
    const now = new Date();
    const ctx = {
        'YYYY': now.getFullYear(),
        'MM': `0${now.getMonth() + 1}`.slice(-2),
        'mm': now.getMonth() + 1,
        'DD': `0${now.getDate()}`.slice(-2),
        'dd': now.getDate(),
        'HASH': md5(Date.now().toString(16)).slice(0, 8),
        ...data,
    };
    return tmpl.replace(/{{(.*?)}}/g, (match, key) => ctx[key.trim()] || '');
}

export function toCamel(name: string) {
    if (!name) throw new Error();
    let tmp = name.replace(/([^\da-z0-9])/ig, '_');
    if (tmp.startsWith('_')) tmp = tmp.slice(1);
    return tmp.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
        return $1 + $2.toUpperCase();
    });
}

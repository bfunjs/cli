import { resolve } from 'path';
import { readFileSync } from 'fs';
// @ts-ignore
import { get, set } from 'lodash';
// @ts-ignore
import WriteJson from 'write-json';

const home = process.env.HOME || process.env.USERPROFILE || __dirname;

export const filename = 'b.config.js'; // 默认配置文件
export const bfunDir = resolve(home, '.bfun'); // CLI默认配置目录
export const bfunCfg = 'bfun.json'; // CLI默认配置目录

function readLocalConfig() {
    const filepath = resolve(bfunDir, bfunCfg);
    try {
        const content = readFileSync(filepath);
        if (!content) return {};
        return JSON.parse(content.toString());
    } catch (e) {
        return {};
    }
}

export async function getValue(key: string, def: string = '') {
    if (!key) return def;
    const data = readLocalConfig();
    return get(data, key, def);
}

export async function setValue(key: string, value: string) {
    if (!key) return;
    const data = readLocalConfig();
    set(data, key, value);
    const filepath = resolve(bfunDir, bfunCfg);
    WriteJson.sync(filepath, data);
}

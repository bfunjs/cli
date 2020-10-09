const path = require('path');
const cp = require('child_process');
const md5 = require('md5');
const compareVersions = require('compare-versions');
const inquirer = require('inquirer');
const portFinder = require('portfinder');
const rimraf = require('rimraf');
const { fetch } = require('@bfun/fetch');
const { FileSystem } = require('@bfun/utils');

const { name, version } = require('../../package.json');
const { logger } = require('./logger');

function cleanDir(filepath) {
    return new Promise((resolve, reject) => {
        try {
            rimraf(filepath, e => {
                if (e) reject(e);
                resolve();
            });
        } catch (e) {
            reject(e);
        }
    });
}

function safeRequire(name) {
    try {
        return require(name);
    } catch (e) {
        logger.error(e);
    }
    return undefined;
}

function bfunRequire(name) {
    if (!name || typeof name !== 'string') return;

    if (name.startsWith('bfun/')) {
        try {
            return require(`../../loaders/${name.slice(5)}`);
        } catch (e) {
            console.error('bfun-cli require error:'.red);
            console.error(e);
            process.exit(1);
        }
    } else if (name.indexOf('//') >= 0) {
        const { bfunDir } = global.bConfig;
        const hash = md5(name);
        const filepath = path.join(bfunDir, `loaders/${hash}.js`);
        const file = new FileSystem.File(filepath);
        if (file.exists()) return safeRequire(filepath);

        console.error('bfun-cli require error:'.red);
        console.error(name);
        process.exit(1);
    }
}

async function installAndRequire(name) {
    const index = name.lastIndexOf('@');
    const pluginName = index > 0 ? name.slice(index) : name;
    let pluginPath;
    try {
        pluginPath = require.resolve(pluginName, { paths: [global.rootDir] });
    } catch (e) {
        cp.execSync(`npm install ${name}`);
        pluginPath = require.resolve(pluginName, { paths: [global.rootDir] });
    }
    return safeRequire(pluginPath);
}

async function findPort(port) {
    portFinder.basePort = +port;
    const validPort = await portFinder.getPortPromise();
    return validPort || port;
}

async function checkLatestVersion() {
    try {
        const url = `http://registry.npm.taobao.org/${name}/latest`;
        const res = await fetch({ url });
        const { version: latest = '' } = res.data;
        if (compareVersions(version, latest) < 0) {
            console.log();
            console.warn(`@bfun/cli 最新版本 ${latest}，当前版本 ${version}`.yellow);
            console.warn('执行命令 npm i @bfun/cli@latest -g 更新至最新版本'.yellow);
            console.log();
        }
    } catch (err) {
        console.log(err);
    }
}

async function getAnswers(ctx, list, data) {
    const keys = [];
    const questions = list.questions.map(item => {
        keys.push(item.name);
        if (item.default && item.default.startsWith(':')) {
            const key = item.default.slice(1, item.default.length);
            item.default = data[key] || '';
        }
        return item;
    });
    const answers = await inquirer.prompt(questions);
    let newRule;
    for (let i = 0, l = list.rules.length; i < l; i++) {
        const rule = list.rules[i];
        const _match = rule.match || [];
        const index = _match.findIndex((value, index) => {
            if (!value) return false;
            const key = keys[index];
            return value !== answers[key];
        });
        if (index < 0) {
            newRule = list.rules[i];
            break;
        }
    }
    if (newRule) {
        if (newRule.questions) {
            await getAnswers(ctx, newRule, { ...data, ...answers });
        } else {
            ctx.data = { ...data, ...answers };
            ctx.repo = newRule.repo;
        }
    } else {
        logger.error('Not Matched');
        process.exit(1);
    }
}

module.exports = {
    cleanDir,
    safeRequire,
    bfunRequire,
    installAndRequire,
    findPort,
    checkLatestVersion,
    getAnswers,
};

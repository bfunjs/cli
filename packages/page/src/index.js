import questions from './questions';
import download from '../../init/src/download';

const fs = require('fs');
const path = require('path');
const ora = require('ora');
const handlebars = require('handlebars');
const { FileSystem } = require('@bfun/utils');

const { getAnswers } = global.common;
const spinner = ora();

const command = 'page';

async function pre(ctx, next) {
    const { args } = ctx;
    await getAnswers(ctx, questions, { page: args[0] || '' });
    await next();
}

async function run(ctx, next) {
    if (!ctx.repo || !ctx.repo.type) {
        console.error('\n ctx.repo 配置有误'.red);
        process.exit(1);
    }
    if (!ctx.data.page) {
        console.error('\n 页面名字不可为空'.red);
        process.exit(1);
    }

    const dist = path.join(global.rootDir, 'src', ctx.data.page);
    const file = new FileSystem.File(dist);
    await file.createIfNotExists();
    const list = (await file.list()).filter(v => v !== '.git');
    if (list.length > 0) {
        console.error('\n 页面初始化目录非空，可能有文件覆盖风险，请在空目录初始化页面'.red);
        console.error(`\n ${list.join('\n')}`.red);
        process.exit(1);
    }

    try {
        spinner.text = '正在下载模板...';
        spinner.start();
        await download(ctx.repo, dist);
        spinner.succeed('模板下载成功！');
        spinner.stop();
    } catch (e) {
        spinner.succeed('模板下载失败！');
        spinner.stop();
        process.exit(1);
    }

    await next();

    if (!ctx.skipCompile) {
        /* eslint-disable */
        spinner.text = '正在初始化页面...';
        spinner.start();
        const callback = typeof ctx.compile === 'function' ? ctx.compile : function (file, context) {
            if (file.contents) {
                const content = file.contents.toString();
                const result = handlebars.compile(content)(context);
                fs.writeFileSync(file.path, result);
            }
        };
        const globs = ['**/*.*', '!node_modules/**', '!.git/**', '!.idea/**'];
        const data = ctx.data || {};
        await file.each(globs, (file, cb) => {
            callback(file, data);
            cb();
        });
        spinner.succeed('初始化页面成功！');
        spinner.stop();
    }
}

async function afterPage(ctx, next) {
    await next();

    const { page } = ctx.data;
    if (!page || typeof page !== 'string') return;
    const packageFile = path.join(global.rootDir, 'package.json');
    let packageJson = {};
    try {
        packageJson = require(packageFile);
    } catch (e) {
        packageJson = {};
    } finally {
        if (!packageJson.scripts) {
            packageJson.scripts = {};
        }
    }

    packageJson.scripts[`start:${page}`] = `bfun dev --config ./src/${page}`;
    packageJson.scripts[`build:${page}`] = `bfun build --config ./src/${page}`;

    const WriteJson = require('write-json');
    WriteJson.sync(packageFile, packageJson);
}

export const when = [command, 'init'];

export function bfun(use) {
    use(command);
    return {
        [command]: {
            before: [pre],
            execute: [run],
            after: [afterPage],
        },
        init: {
            after: [afterPage],
        },
    };
}

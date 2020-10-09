import download from './download';
import { QBfunDefault } from './questions';

const fs = require('fs');
const path = require('path');
const ora = require('ora');
const handlebars = require('handlebars');
const { FileSystem } = require('@bfun/utils');

const { getAnswers } = global.common;
const spinner = ora();

const command = 'init';

async function pre(ctx, next) {
    await next();

    const { args, questions } = ctx;
    const [tmpl, appName] = args;

    ctx.dist = appName ? path.join(global.rootDir, appName) : global.rootDir;
    const basename = path.basename(ctx.dist);
    const defValue = { tmpl, name: basename };
    if (questions && questions.length) {
        await getAnswers(ctx, questions, defValue);
    } else {
        await QBfunDefault(ctx, defValue);
    }

    const { name } = ctx.data;
    if (name && name !== basename) {
        ctx.dist = typeof name === 'string' ? path.join(process.cwd(), name) : process.cwd();
    }
}

async function run(ctx, next) {
    if (!ctx.repo || !ctx.repo.type) {
        console.error('\n ctx.repo 配置有误'.red);
        process.exit(1);
    }
    /**
     * dist 可能会有变动，例如：
     * process.cwd() 是： /workspace
     * 项目目录是： /workspace/demo
     */
    if (ctx.dist) global.rootDir = ctx.dist;

    const file = new FileSystem.File(ctx.dist);
    await file.createIfNotExists();
    const list = (await file.list()).filter(v => v !== '.git');
    if (list.length > 0) {
        console.error('\n 待初始化目录非空目录，可能有文件覆盖风险，请在空目录初始化'.red);
        console.error(`\n ${list.join('\n')}`.red);
        process.exit(1);
    }

    try {
        spinner.text = '正在下载模板...';
        spinner.start();
        await download(ctx.repo, ctx.dist);
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
        spinner.text = '正在初始化...';
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
        spinner.succeed('初始化成功！');
        spinner.stop();
    }
}

async function rename(ctx, next) {
    const file = new FileSystem.File(path.join(ctx.dist, 'src/initial'));
    if (file.exists() && ctx.data.page) {
        await file.moveTo(path.join(ctx.dist, 'src', ctx.data.page));
    }

    await next();
}

export const when = [command];

export function bfun(use) {
    use(command);
    return {
        [command]: {
            before: [pre],
            execute: [run, rename],
        },
    };
}

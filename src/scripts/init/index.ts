import inquirer from 'inquirer';
import { Context, Use } from '../../types';
import { logger } from '../../shared/logger';

const command = 'init';
const question = [
    {
        type: 'input',
        name: 'username',
        message: 'username',
    },
    {
        type: 'password',
        name: 'password',
        message: 'password',
    },
];

async function init(ctx: Context, next: any) {
    // const { args } = ctx;
    const data = await inquirer.prompt(question);

    logger.line().green(data);

    await next();
}

async function help(ctx: Context, next: any) {
    ctx.help.push({});

    await next();
}

export default function (use: Use) {
    const lifecycle = {
        before: [],
        execute: [ init ],
        help: [ help ],
    };
    use(command, lifecycle);
};

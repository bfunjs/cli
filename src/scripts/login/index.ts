import inquirer from 'inquirer';
import { Context, Use } from '../../types';
import { logger } from '../../shared/logger';

const command = 'login';
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

async function login(ctx: Context, next: any) {
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
        execute: [ login ],
        help: [ help ],
    };
    use(command, lifecycle);
};

const inquirer = require('inquirer');

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

async function login(ctx, next) {
    // const { args } = ctx;
    const value = await inquirer.prompt(question);
    console.log(value);

    await next();
}

export const when = [ command ];

export function bfun(use) {
    use(command);
    return {
        [command]: {
            before: [],
            execute: [ login ],
        },
    };
}

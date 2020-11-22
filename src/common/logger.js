const chalk = require('chalk');

exports.logger = {
    line(rows = 1) {
        for (let i = 0; i < rows; i++) {
            console.log();
        }
    },
    log(...args) {
        if (process.env.DEBUG === 'true') {
            console.log.apply(this, args);
        }
    },
    info(...args) {
        if (process.env.DEBUG === 'true') {
            console.log.apply(this, args.map(v => chalk.bold(v)));
        }
    },
    warn(...args) {
        if (process.env.DEBUG === 'true') {
            console.log.apply(this, args.map(v => chalk.bold(chalk.yellow(v))));
        }
    },
    error(...args) {
        if (process.env.DEBUG === 'true') {
            console.log.apply(this, args.map(v => chalk.bold(chalk.red(v))));
        }
    },
    success(...args) {
        if (process.env.DEBUG === 'true') {
            console.log.apply(this, args.map(v => chalk.bold(chalk.green(v))));
        }
    },
};

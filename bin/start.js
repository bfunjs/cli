const path = require('path');
const cp = require('child_process');

function start() {
    const bfun = path.resolve(__dirname, 'bfun');
    const child = cp.fork(bfun, process.argv.slice(2));
    child.on('message', data => {
        if (data === 'restart') {
            child.kill('SIGINT');
            start();
        }
    });
    child.on('exit', code => code && process.exit(code));
}

module.exports = start;

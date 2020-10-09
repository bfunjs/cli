const childProcess = require('child_process');
const compareVersions = require('compare-versions');

const currentVersion = childProcess.execSync('node --version').toString().trim();
const minNodeVersion = '8.9.0';

if (compareVersions(currentVersion, minNodeVersion) < 1) {
    console.error(`bfun-cli 需要 Node.js 版本在 ${minNodeVersion}+`.red);
    process.exit(1);
}

process.env.NODE_ENV = 'production';
process.env.DEBUG = true;
process.env.isLocal = false;

global.version = require('../package.json').version;
global.bConfig = require('../b.config');
global.rootDir = process.cwd();
global.userDir = process.env.HOME || process.env.USERPROFILE;
// global.pageDir = process.cwd();
// global.bfunDir = process.cwd();

global.request = require('@bfun/fetch').fetch;
global.common = require('./common');

process.on('unhandledRejection', reason => {
    if (reason) {
        if (reason instanceof Error) {
            const { message, code = 1 } = reason;
            console.error(message.red);
            console.error(reason);
            process.exit(code);
            return;
        }
        process.exit(1);
    }
});



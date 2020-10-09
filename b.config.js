const path = require('path');
const home = process.env.HOME || process.env.USERPROFILE;

module.exports = {
    bfunDir: path.resolve(home, '.bfun'), // 默认目录
    bfunCfg: 'bfun.json',
    loaders: {
        dirname: 'loaders', // Loaders配置目录
        filename: 'config.json', // Loaders配置文件
    },
    filename: 'b.config.js', // 默认配置文件
    defaultBConfig: {
        framework: 'webpack',
        solutions: ['@bfun/solution-webpack4-standard'],
    },
};

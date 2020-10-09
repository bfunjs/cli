const fs = require('fs-extra');
const execa = require('execa');

const allPackages = fs.readdirSync('packages').filter(file => {
    if (!fs.statSync(`packages/${file}`).isDirectory()) {
        return false;
    }
    if (!fs.existsSync(`packages/${file}/package.json`)) {
        return false;
    }
    const pkg = require(`../packages/${file}/package.json`);
    return !pkg.private;
});

async function build(target) {
    await execa(
        'rollup',
        [
            '-c',
            '--environment',
            [
                'NODE_ENV:production',
                `TARGET:${target}`,
            ]
                .filter(Boolean)
                .join(',')
        ],
        { stdio: 'inherit' }
    );
}

async function buildAll(allPackages) {
    for (const name of allPackages) {
        await build(name);
    }
}

buildAll(allPackages).then(() => {
    console.log();
    console.log('build all loaders succeed');
});

const path = require('path');
const zlib = require('zlib');
const tarfs = require('tar-fs');
const vfs = require('vinyl-fs');
const map = require('map-stream');
const rimraf = require('rimraf');

function getGitInfo(url = '') {
    const result = { group: '', name: '' };
    let gitUrl = url;
    if (url.trim().endsWith('.git')) {
        gitUrl = url.slice(0, url.length - 4);
        if (url.startsWith('git@')) {
            gitUrl = gitUrl.replace(/:/g, '/');
        }
    }
    const gitArr = gitUrl.split('/');
    const length = gitArr.length;
    result.group = gitArr[length - 2];
    result.name = gitArr[length - 1];
    return result;
}

function rewriteDotFiles(file, cb) {
    file.path = file.path.replace(/_(\.\w+)$/, '$1');
    cb(null, file);
}

async function gitDownload(data, dist) {
    const { url, ...options } = data;
    let gitUrl = url;
    if (!url.startsWith('git@')) {
        const gitInfo = getGitInfo(url);
        gitUrl = `${gitInfo.group}/${gitInfo.name}`;
    }
    const downloadGitRepo = require('download-git-repo');
    return new Promise((resolve, reject) => {
        downloadGitRepo(gitUrl, dist, options, err => {
            if (err) reject(err);
            resolve();
        });
    });
}

async function npmDownload(data, dist) {
    const { name, tags = 'latest', registry = 'https://registry.npmjs.org' } = data;
    const { data: npmInfo } = await global.request({ url: `${registry}/${name}` });
    const { versions } = npmInfo;
    let pkgInfo;
    let version = npmInfo['dist-tags'][tags];
    if (version) pkgInfo = versions[version];
    else pkgInfo = versions[tags];

    if (pkgInfo && pkgInfo.dist) {
        await tarDownload({ url: pkgInfo.dist.tarball }, dist);
    }
}

async function tarDownload({ url }, dist) {
    const tmpDir = path.join(global.rootDir, '.tartmp');
    const output = path.resolve(dist);

    const npmRepo = await global.request({
        url: url,
        responseType: 'stream',
    });

    await new Promise(resolve => npmRepo.data
        .pipe(zlib.createGunzip())
        .pipe(tarfs.extract(tmpDir))
        .on('finish', () => {
            vfs.src('**/*', { cwd: path.join(tmpDir, 'package'), dot: true })
                .pipe(map(rewriteDotFiles))
                .pipe(vfs.dest(output))
                .on('finish', () => {
                    rimraf.sync(tmpDir);
                    resolve();
                });
        }));
}

export default async function download(data, dist) {
    const { type } = data;
    const mapper = {
        'git': gitDownload,
        'npm': npmDownload,
        'tar': tarDownload,
        'file': undefined,
    };

    if (mapper[type]) await mapper[type](data, dist);
}

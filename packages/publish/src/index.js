const { readBConfig } = global.common;
const pack = require('npm-packlist');
const fs = require('fs');
const tar = require('tar-fs');

const command = 'publish';

export const when = [ command ];


// https://cdn.bfunjs.com/archives/bfunjs/banner/1.0.1/source.tar
// https://cdn.bfunjs.com/archives/bfunjs/banner/1.0.1/package.json
// https://cdn.bfunjs.com/archives/bfunjs/banner/1.0.1/dependencies.json
// https://cdn.bfunjs.com/packages/bfunjs/banner/1.0.1/umd.js
// https://cdn.bfunjs.com/packages/bfunjs/banner/1.0.1/umd.css
// https://cdn.bfunjs.com/packages/bfunjs/banner/1.0.1/esm.js

function packDir(ctx) {
    const { rootDir } = global;
    console.log(rootDir, ctx);

    pack({ path: rootDir })
        .then(files => {
            console.log('start', files);
            return new Promise(resolve => {
                tar.pack(
                    rootDir,
                    {
                        entries: files,
                        map: function (header) {
                            header.name = `package/${header.name}`;
                            return header;
                        },
                    },
                )
                    .pipe(fs.createWriteStream('Ver.1.0.1.tar'))
                    .on('finish', () => {
                        console.log('pack', files);
                        resolve(files);
                    });
            });
        })
        .then((files) => {
            console.log('end', files);
        });
}

export function bfun(use) {
    use(command);
    return {
        [command]: {
            before: [ readBConfig, packDir ],
            execute: [],
        },
    };
}

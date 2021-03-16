import { createWriteStream } from 'fs';
import pack from 'npm-packlist';
import tar from 'tar-fs';
import { Context, BContext, Use } from '../../types';
import { logger } from '../../shared/logger';
import { readConfig } from '../../shared/middleware/config';

const command = 'publish';

// https://cdn.bfunjs.com/archives/bfunjs/banner/1.0.1/source.tar
// https://cdn.bfunjs.com/archives/bfunjs/banner/1.0.1/package.json
// https://cdn.bfunjs.com/archives/bfunjs/banner/1.0.1/dependencies.json
// https://cdn.bfunjs.com/packages/bfunjs/banner/1.0.1/umd.js
// https://cdn.bfunjs.com/packages/bfunjs/banner/1.0.1/umd.css
// https://cdn.bfunjs.com/packages/bfunjs/banner/1.0.1/esm.js
async function packDir(rootDir: string) {
    const files = await pack({ path: rootDir });
    return new Promise(resolve => {
        tar.pack(
            rootDir,
            {
                entries: files,
                map: function (header: any) {
                    header.name = `package/${header.name}`;
                    return header;
                },
            },
        )
            .pipe(createWriteStream('Ver.1.0.1.tar'))
            .on('finish', () => {
                console.log('pack', files);
                resolve(files);
            });
    });
}

async function pre(ctx: BContext, next: any) {
    const { rootDir } = global;
    const files = await packDir(rootDir);

    logger.line().green(files);

    await next();
}

async function publish(ctx: Context, next: any) {
    await next();

    logger.green('start upload');
}

async function help(ctx: Context, next: any) {
    ctx.help.push({});

    await next();
}

export default function (use: Use) {
    const lifecycle = {
        before: [ readConfig, pre ],
        execute: [ publish ],
        help: [ help ],
    };
    use(command, lifecycle);
};

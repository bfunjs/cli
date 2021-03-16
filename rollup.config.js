import fs from 'fs';
import path from 'path';
import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import rollupJson from '@rollup/plugin-json';

if (!process.env.TARGET) {
    throw new Error('TARGET package must be specified via --environment flag.');
}

const target = process.env.TARGET;
const packageDir = path.resolve(__dirname, 'packages', target);
const tsEntryPath = path.resolve(packageDir, 'src/index.ts');
const jsEntryPath = path.resolve(packageDir, 'src/index.js');

export default {
    input: fs.existsSync(tsEntryPath) ? tsEntryPath : jsEntryPath,
    output: {
        file: path.resolve(__dirname, `loaders/${target}.js`),
        format: 'cjs'
    },
    plugins: [
        rollupJson({ namedExports: false }),
        rollupResolve(),
        rollupCommonjs({
            exclude: 'node_modules/**'
        }),
    ],
    treeshake: {
        moduleSideEffects: false
    }
};

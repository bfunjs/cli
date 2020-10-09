const getCmd = 'get';
const setCmd = 'set';

async function getter(ctx, next) {
    await next();

    const { args } = ctx;
    const { getValue } = global.common;
    const [key] = args || [];
    const value = await getValue(key);
    console.log(value);
}

async function setter(ctx, next) {
    await next();

    const { args } = ctx;
    const { getValue, setValue } = global.common;
    const [key, val] = args || [];
    if (key.startsWith('loaders')) {
        console.log();
        console.error('请使用 bfun use 修改 loaders'.red);
        return;
    }

    await setValue(key, val || '');

    const value = await getValue(key);
    console.log(value);
}

export const when = [getCmd, setCmd];

export function bfun(use) {
    use(`${getCmd} [key]`);
    use(`${setCmd} [key] [value]`);
    return {
        [getCmd]: {
            execute: [getter],
        },
        [setCmd]: {
            execute: [setter],
        },
    };
}

import { Context, Use } from '../../types';
import { getValue, setValue } from '../../config';
import { logger } from '../../shared/logger';

const getCmd = 'get';
const setCmd = 'set';

const def = 'undefined';

async function getter(ctx: Context, next: any) {
    await next();

    const [ key = '' ] = ctx.args;
    const value = await getValue(key, def);
    logger.green(key, '=', value);
}

async function setter(ctx: Context, next: any) {
    await next();

    const [ key, val ] = ctx.args;
    if (key.startsWith('scripts')) {
        logger.line().error('请使用 bfun use <scripts filepath> 修改 scripts');
        return;
    }

    await setValue(key, val || '');
    const value = await getValue(key, def);
    logger.green(key, '=', value);
}

export default function (use: Use) {
    use(getCmd, {
        execute: [ getter ],
    });
    use(setCmd, {
        execute: [ setter ],
    });
}

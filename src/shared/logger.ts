export const logger = {
    line(rows: number = 1) {
        for (let i = 0; i < rows; i++) console.log();
        return this;
    },
    info(...args: any[]) {
        if (process.env.DEBUG) {
            console.log.apply(this, args);
        }
        return this;
    },
    warn(...args: any[]) {
        if (process.env.DEBUG) {
            // @ts-ignore
            console.log.apply(this, args.map(v => typeof v === 'string' ? v.yellow : v));
        }
        return this;
    },
    error(...args: any[]) {
        if (process.env.DEBUG) {
            // @ts-ignore
            console.log.apply(this, args.map(v => typeof v === 'string' ? v.red : v));
        }
        return this;
    },
    green(...args: any[]) {
        if (process.env.DEBUG) {
            // @ts-ignore
            console.log.apply(this, args.map(v => typeof v === 'string' ? v.green : v));
        }
        return this;
    }
};

exports.logger = {
    log(...args) {
        if (process.env.DEBUG) {
            console.log.apply(this, args);
        }
    },
    error(...args) {
        if (process.env.DEBUG) {
            console.error.apply(this, args);
        }
    },
    info(...args) {
        if (process.env.DEBUG) {
            console.info.apply(this, args);
        }
    },
};
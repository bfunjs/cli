const { readBConfig } = global.common;

const command = 'publish';

export const when = [command];

export function bfun(use) {
    use(command);
    return {
        [command]: {
            before: [readBConfig],
            execute: [],
        },
    };
}

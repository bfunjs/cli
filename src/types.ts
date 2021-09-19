import { Middleware } from '@bfun/runtime';

export interface Lifecycle {
    before: Middleware;
    execute: Middleware;
    after: Middleware;
}

export interface InitObj {
    before?: Array<(ctx?: any, next?: any) => void>;
    execute?: Array<(ctx?: any, next?: any) => void>;
    after?: Array<(ctx?: any, next?: any) => void>;
    help?: Array<(ctx?: any, next?: any) => void>;
}

export type Use = (command: string, lifecycle: InitObj) => any;

export interface Plugin {
    required: string[];
    version?: string;
    extensions: string[];

    [key: string]: any;
}

/**
 * b.config.js 文件内配置的 solution 属性
 */
export interface Solution {
    name: string | Plugin;
    ssr?: boolean;

    [key: string]: any;
}

/**
 * b.config.js 文件配置
 */
export interface BConfig {
    debug?: boolean;
    framework: string;
    solutions: (string | Solution)[];
    sourceMap?: boolean;
    devServer?: {
        host?: string;
        port?: number;
    },
    configure?: (chain: any) => boolean;

    [key: string]: any;
}

/**
 * Compose Context
 */
export interface Context {
    name: string;
    args: string[];
    opts: { [key: string]: string | number | boolean };
    help: object[];

    [key: string]: any;
}

export interface BContext extends Context {
    bConfig: BConfig;

    solution: {
        skip: string[];
        options: { [key: string]: any };

        [key: string]: any;
    }
}

export enum EFramework {
    webpack,
    rollup,
    vite,
    react,
    vue,
}

export interface ISolution {
    solution: string,
    ssr?: boolean,
    clean?: any,
    assets?: any,
    babel?: any,
    degrade?: any,
    fonts?: any,
    less?: any,
    style?: any,
    template?: any,
    rem?: {
        px2rem?: any,
        rootValue?: number,
        propList?: any,
        minPixelValue?: number,
    },
    vue?: any,
    server?: any,
    client?: any,
}

/**
 * react: dev[webpack] build[webpack]
 * vue: dev[webpack] build[webpack]
 * react: dev[webpack] build[webpack]
 */
export interface IBConfig {
    debug: boolean,
    framework: EFramework,
    solutions: (ISolution | string)[],
    sourceMap?: boolean,
    devServer?: {
        host: string,
        post: number,
    },
    configure?: ((chain: any) => any) | { [key: string]: string }
}

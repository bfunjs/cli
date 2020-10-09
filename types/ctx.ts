export interface IContext {
    name: string,
    opts: { [key: string]: string },
    args: string[],
    bConfig: {
        debug?: boolean,
        framework: string,
        solutions: (string | { [key: string]: any })[],
        devServer: {
            host?: string,
            port?: number,
        }
    }
}

export interface IDevBuildContext {
    filepath?: string, // watch file path
    host?: string,
    port?: number,
    solution: {
        skip: string[],
        options: { [key: string]: any },
        webpack: any[],
    },
}

export interface IInitContext {
    questions: any[],
    dist: string,
    data: {
        [key: string]: string
    },
    repo: {
        [key: string]: string
    },
    compile?: (file: any, context: any) => void
}
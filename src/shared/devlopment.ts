import finder from 'portfinder';

export let defaultPort = 6699;

export async function findPort(port: unknown): Promise<number> {
    const basePort = Number(port) || defaultPort;
    finder.basePort = basePort;
    return (await finder.getPortPromise()) || basePort;
}

export function addScripts(scirpts: string[]) {

}

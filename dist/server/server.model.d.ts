export interface IServer {
    id: string;
    name: string;
    ip: string;
    url: string;
    sshLogin: string;
    sshPassword: string;
    serverType: string;
    provider: string;
    state: {
        memory: string;
        cache: string;
        DD: string;
        proc: string;
    };
}
export interface IServerCreationParams {
    name: string;
    ip: string;
    url: string;
    sshLogin: string;
    sshPassword: string;
    serverType: string;
    provider: string;
    state: {
        memory: string;
        cache: string;
        DD: string;
        proc: string;
    };
}
export interface IServerUpdateParams {
    name?: string;
    ip?: string;
    url?: string;
    sshLogin?: string;
    sshPassword?: string;
    serverType?: string;
    provider?: string;
    state: {
        memory?: string;
        cache?: string;
        DD: string;
        proc?: string;
    };
}

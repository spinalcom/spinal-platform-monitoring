export interface IPlatform {
    id: string;
    name: string;
    type: string;
    statusPlatform: statusPlatform;
    TokenBosRegister?: string;
    infoHub: {
        ip: string;
        port: number;
        url: string;
        login: string;
        password: string;
    };
    infoWall: {
        ip: string;
        port: number;
        url: string;
        login: string;
        password: string;
    };
}
export interface IPlateformCreationParams {
    name: string;
    type?: string;
    statusPlatform?: statusPlatform;
    TokenBosRegister?: string;
    infoHub: {
        ip: string;
        port: number;
        url: string;
        login: string;
        password: string;
    };
    infoWall: {
        ip: string;
        port: number;
        url: string;
        login: string;
        password: string;
    };
}
export interface IPlatformUpdateParams {
    name?: string;
    statusPlatform?: statusPlatform;
    infoHub: {
        ip?: string;
        port?: number;
        url?: string;
        login?: string;
        password?: string;
    };
    infoWall: {
        ip?: string;
        port?: number;
        url?: string;
        login?: string;
        password?: string;
    };
}
export interface IRegisterParams {
    platformCreationParms: IPlateformCreationParams;
    registerKey: string;
}
export interface IRegisterKeyObject {
    id: string;
    name: string;
    type: string;
    value: string;
}
export declare enum statusPlatform {
    'online' = "online",
    'fail' = "fail",
    'stop' = "stop"
}
export interface IPlatformLogs {
    id: string;
    name: string;
    type: string;
    date: string;
    message: string;
    actor: {
        actorId: string;
        actorName: string;
    };
}

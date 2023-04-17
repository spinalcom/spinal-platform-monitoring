export interface IPlatform {
    id: string;
    name: string;
    type: string;
    statusPlatform: statusPlatform;
    url: string;
    address?: string;
    TokenBosAdmin?: string;
    TokenAdminBos?: string;
    idPlatformOfAdmin?: string;
}
export interface IPlateformCreationParams {
    name: string;
    type?: string;
    url: string;
    statusPlatform?: statusPlatform;
    address: string;
    TokenBosAdmin?: string;
    TokenAdminBos?: string;
    idPlatformOfAdmin?: string;
}
export interface IPlatformUpdateParams {
    name: string;
    statusPlatform?: statusPlatform;
    url?: string;
    address?: string;
    TokenBosAdmin?: string;
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

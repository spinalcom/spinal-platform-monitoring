export interface IOrgan {
    id?: string;
    name?: string;
    type?: string;
    bootTimestamp?: number;
    lastHealthTime?: number;
    ramHeapUsed?: string;
    statusOrgan?: StatusOrgan;
    organType?: string;
    ipAdress?: string;
    port?: number;
    protocol?: string;
    platformId?: string;
}
export interface IOrganCreationParams {
    name: string;
    type?: string;
    bootTimestamp?: number;
    lastHealthTime?: number;
    ramHeapUsed?: string;
    statusOrgan?: StatusOrgan;
    organType?: string;
    ipAdress?: string;
    port?: number;
    protocol?: string;
    platformId?: string;
}
export interface IOrganUpdateParams {
    name: string;
    bootTimestamp?: number;
    lastHealthTime?: number;
    ramHeapUsed?: string;
    statusOrgan?: StatusOrgan;
    organType?: string;
    ipAdress?: string;
    port?: number;
    protocol?: string;
    platformId?: string;
}
export declare enum StatusOrgan {
    'online' = "online",
    'fail' = "fail",
    'stop' = "stop"
}

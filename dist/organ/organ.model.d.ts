export interface IOrganCreationParams {
    name: string;
    type?: string;
    organType: string;
    statusOrgan: string;
    platformId: string;
}
export interface IOrganUpdateParams {
    name: string;
    organType: string;
    statusOrgan: statusOrgan;
    platformId: string;
}
export interface IOrgan {
    id?: string;
    name?: string;
    statusOrgan: statusOrgan;
    organType: string;
    type?: string;
    platformId: string;
}
export declare enum statusOrgan {
    'online' = "online",
    'fail' = "fail",
    'stop' = "stop"
}

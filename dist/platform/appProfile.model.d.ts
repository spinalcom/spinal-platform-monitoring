export interface IAppProfileCreationParams {
    appProfileId: string;
    name: string;
    type?: string;
    platformId: string;
}
export interface IAppProfileUpdateParams {
    name: string;
}
export interface IAppProfile {
    id?: string;
    appProfileId: string;
    name?: string;
    type?: string;
    platformId: string;
}

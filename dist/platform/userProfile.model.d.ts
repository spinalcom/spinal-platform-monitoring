export interface IUserProfileCreationParams {
    userProfileId: string;
    name: string;
    type?: string;
    platformId: string;
}
export interface IUserProfileUpdateParams {
    name: string;
}
export interface IUserProfile {
    id: string;
    userProfileId: string;
    name: string;
    type: string;
    platformId: string;
}

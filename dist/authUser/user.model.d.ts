/**
 * @export
 * @interface User
 */
export interface IUser {
    id: string | number;
    type: string;
    name: string;
    userName: string;
    password: string;
    email?: string;
    telephone?: string;
    info?: string;
    userType: IUserType;
    platformList?: {
        platformId: string;
        userProfile: {
            name: string;
            userProfileId: string;
        };
    }[];
}
export declare enum IUserType {
    'authAdmin' = "authAdmin",
    'Super User' = "Super User",
    'Simple User' = "Simple User"
}
/**
 * @export
 * @interface IUserCreationParams
 */
export interface IUserCreationParams {
    userName: string;
    password: string;
    email?: string;
    telephone?: string;
    info?: string;
    userType: IUserType;
    platformList?: {
        platformId: string;
        userProfile: {
            name: string;
            userProfileId: string;
        };
    }[];
}
export interface IUserUpdateParams {
    userName?: string;
    password?: string;
    email?: string;
    telephone?: string;
    info?: string;
    userType?: IUserType;
    platformList?: {
        platformId: string;
        platformName: string;
        userProfile: {
            userProfileAdminId: string;
            userProfileBosConfigId: string;
            userProfileName: string;
        };
    }[];
}
export interface IAuthAdminUpdateParams {
    userName: string;
    oldPassword?: string;
    newPassword?: string;
    email?: string;
    telephone?: string;
    info?: string;
}
export interface IUserLoginParams {
    userName: string;
    password: string;
}
export interface IUserLogs {
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

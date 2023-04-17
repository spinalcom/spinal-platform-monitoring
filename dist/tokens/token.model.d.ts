/**
 *
 *
 * @export
 * @interface Token
 */
export interface IToken {
    id: string;
    name: string;
    type: string;
    token: string;
    createdToken?: number;
    expieredToken?: number;
    userId?: string;
    userType: string;
}
export interface IUserToken {
    name?: string;
    type?: string;
    token?: string;
    createdToken?: number;
    expieredToken?: number;
    userId?: string;
    userType?: string;
    userProfile?: string;
    serverId?: string;
    platformList?: {
        platformId: string;
        platformName: string;
        idPlatformOfAdmin: string;
        userProfile: {
            userProfileAdminId: string;
            userProfileBosConfigId: string;
            userProfileName: string;
        };
    }[];
}
export interface IApplicationToken {
    name?: string;
    type?: string;
    token?: string;
    createdToken?: number;
    expieredToken?: number;
    applicationId?: string;
    applicationProfileList?: string[];
    platformList?: {
        platformId: string;
        platformName: string;
        idPlatformOfAdmin: string;
        appProfile: {
            appProfileAdminId: string;
            appProfileBosConfigId: string;
            appProfileName: string;
        };
    }[];
}

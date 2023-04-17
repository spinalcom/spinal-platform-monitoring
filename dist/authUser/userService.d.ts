import { SpinalGraph, SpinalNode } from 'spinal-env-viewer-graph-service';
import { IUser, IUserCreationParams, IUserUpdateParams, IAuthAdminUpdateParams, IUserLoginParams, IUserLogs } from './user.model';
import { IUserToken } from '../tokens/token.model';
import SpinalMiddleware from '../spinalMiddleware';
/**
 * @export
 * @class UserService
 */
export declare class UserService {
    spinalMiddleware: SpinalMiddleware;
    graph: SpinalGraph<any>;
    constructor();
    getProfile(platformId: string, profileIdBosConfig: string): Promise<SpinalNode<any>>;
    createUser(userCreationParams: IUserCreationParams): Promise<IUser>;
    login(userLoginParams: IUserLoginParams): Promise<IUserToken>;
    loginAuthAdmin(userLoginParams: IUserLoginParams): Promise<IUserToken>;
    getUsers(): Promise<IUser[]>;
    getUser(id: string): Promise<IUser>;
    updateUser(userId: string, requestBody: IUserUpdateParams): Promise<IUser>;
    deleteUser(userId: string): Promise<void>;
    createAuthAdmin(): Promise<IUser>;
    updateAuthAdmin(requestBody: IAuthAdminUpdateParams): Promise<IUser>;
    getAuthAdmin(): Promise<IUser>;
    getInfoToken(tokenParam: string): Promise<{
        name: string;
        userProfileId: any;
        token: any;
        createdToken: any;
        expieredToken: any;
        userId: any;
        serverId: any;
        id: string;
    }>;
    userProfilesList(): Promise<any[]>;
    getRoles(): Promise<{
        name: string;
    }[]>;
    getUserLogs(id: string): Promise<IUserLogs[]>;
}

import { SpinalGraph } from 'spinal-env-viewer-graph-service';
import { IUser, IUserCreationParams, IUserUpdateParams, IUserLoginParams, IUserLogs } from './user.model';
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
    createUser(userCreationParams: IUserCreationParams): Promise<IUser>;
    login(userLoginParams: IUserLoginParams): Promise<IUserToken>;
    loginMonitoringAdmin(userLoginParams: IUserLoginParams): Promise<IUserToken>;
    getUsers(): Promise<IUser[]>;
    getUser(id: string): Promise<IUser>;
    updateUser(userId: string, requestBody: IUserUpdateParams): Promise<IUser>;
    deleteUser(userId: string): Promise<void>;
    createMonitoringAdmin(): Promise<IUser>;
    updateMonitoringAdmin(requestBody: IUserUpdateParams): Promise<IUser>;
    getMonitoringAdmin(): Promise<IUser>;
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

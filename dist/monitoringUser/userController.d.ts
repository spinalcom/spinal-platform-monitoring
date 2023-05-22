import { Controller } from 'tsoa';
import { IUser, IUserCreationParams, IUserUpdateParams, IUserLoginParams, IUserLogs } from './user.model';
import { IUserToken } from '../tokens/token.model';
export declare class UsersController extends Controller {
    createUser(requestBody: IUserCreationParams): Promise<IUser>;
    getUsers(): Promise<IUser[]>;
    getUser(userId: string): Promise<IUser>;
    deleteUser(userId: string): Promise<void>;
    updateUser(userId: string, requestBody: IUserUpdateParams): Promise<IUser>;
    updateMonitoringAdmin(requestBody: IUserUpdateParams): Promise<IUser>;
    getMonitoringAdmin(): Promise<IUser>;
    userProfilesList(): Promise<any[]>;
    login(requestBody: IUserLoginParams): Promise<IUserToken>;
    loginMonitoringAdmin(requestBody: IUserLoginParams): Promise<IUserToken>;
    getRoles(): Promise<{
        name: string;
    }[]>;
    getUserLogs(userId: string): Promise<IUserLogs[]>;
}

/**
 * @export
 * @interface User
 */
export interface IUser {
    id: string | number;
    type: string;
    name: string;
    email: string;
    password: string;
    userType: string;
}
export declare enum IUserType {
    'MonitoringAdmin' = "MonitoringAdmin",
    'User' = "User"
}
/**
 * @export
 * @interface IUserCreationParams
 */
export interface IUserCreationParams {
    email: string;
    userType: string;
    password: string;
}
export interface IUserUpdateParams {
    name?: string;
    email?: string;
    oldPassword?: string;
    newPassword?: string;
    password?: string;
    userType?: string;
}
export interface IUserLoginParams {
    email: string;
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

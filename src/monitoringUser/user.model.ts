/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

/**
 * @export
 * @interface User
 */
export interface IUser {
  id: string | number;
  type: string;
  name: string; //nom du noeud du graph
  email: string;
  password: string;
  userType: string;
}
export enum IUserType {
  'MonitoringAdmin' = 'MonitoringAdmin',
  'User' = 'User',
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
  }
}
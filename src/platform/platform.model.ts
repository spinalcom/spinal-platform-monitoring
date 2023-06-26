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


export interface IPlatform {
  id: string;
  name: string;
  type: string;
  statusPlatform: statusPlatform;
  TokenBosRegister?: string;
  infoHub: {
    ip: string;
    port: number;
    url: string;
    login: string;
    password: string;
  },
  infoWall: {
    ip: string;
    port: number;
    url: string;
    login: string;
    password: string;
  },
  organList?: {
    organId: string;
    organName: string;
  }[]
}

export interface IPlateformCreationParams {
  name: string;
  type?: string;
  statusPlatform?: statusPlatform;
  TokenBosRegister?: string;
  infoHub?: {
    ip: string;
    port: number;
    url: string;
    login: string;
    password: string;
  },
  infoWall?: {
    ip: string;
    port: number;
    url: string;
    login: string;
    password: string;
  },
  organList?: {
    organId: string;
    organName: string;
  }[]
}

export interface IPlatformUpdateParams {
  name?: string;
  statusPlatform?: statusPlatform;
  infoHub: {
    ip?: string;
    port?: number;
    url?: string;
    login?: string;
    password?: string;
  },
  infoWall: {
    ip?: string;
    port?: number;
    url?: string;
    login?: string;
    password?: string;
  },
  organList?: {
    organId: string;
    organName: string;
  }[]
}
export interface IRegisterParams {
  platformCreationParms: IPlateformCreationParams;
  registerKey: string;
}
export interface IRegisterKeyObject {
  id: string;
  name: string;
  type: string;
  value: string;
}

export enum statusPlatform {
  'online' = 'online',
  'fail' = 'fail',
  'stop' = 'stop',
}

export interface IPlatformLogs {
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

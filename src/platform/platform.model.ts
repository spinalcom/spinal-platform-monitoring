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
import {
  IOrgan,
  IOrganHub,
  IOrganHubCreationParams,
  IOrganHubUpdateParams
} from "../organ/organ.model";

export interface IPlatform {
  id: string;
  name: string;
  type: string;
  platformType: string;
  TokenBosRegister?: string;
  ipAdress: string;
  url: string;
  loginAdmin: string;
  passwordAdmin: string;
  hubOrgan?: IOrganHub;
  organList?: {
    organId: string;
    organName: string;
  }[]
}

export interface IPlateformCreationParams {
  name: string;
  type: string;
  platformType: string;
  TokenBosRegister?: string;
  ipAdress: string;
  url: string;
  loginAdmin: string;
  passwordAdmin: string;
  hubOrgan: IOrganHubCreationParams
  [Symbol.iterator](): Iterator<any>;
}

export interface IPlatformUpdateParams {
  name: string;
  type: string;
  platformType: string;
  TokenBosRegister?: string;
  ipAdress: string;
  url: string;
  loginAdmin: string;
  passwordAdmin: string;
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



export interface IPlatformPushDataParams {
  id: string;
  name: string;
  type: string;
  platformType: string;
  TokenBosRegister?: string;
  ipAdress: string;
  url: string;
  loginAdmin: string;
  passwordAdmin: string;
  organList?: {
    organId: string;
    organName: string;
  }[]
}

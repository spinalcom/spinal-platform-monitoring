/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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

export interface IHealth {
  genericOrganData: IGenericOrganData;
  specificOrganData: ISpecificOrganData;
}

export interface IHealthCreationParams {
  TokenBosRegister: string;
  infoOrgans: {
    genericOrganData: IGenericOrganData;
    specificOrganData: ISpecificOrganData;
  }[]

}

interface ILog {
  timeStamp: number,
  message: string
}

interface IGenericOrganData {
  name: string,
  bootTimestamp: number,
  lastHealthTime: number
  ramHeapUsed: string,
  logList: ILog[]
}


interface ISpecificOrganData {
  state: string,
  ipAdress: string,
  port: number,
  protocol: string,
  lastAction: {
    message: string,
    date: number
  }
}
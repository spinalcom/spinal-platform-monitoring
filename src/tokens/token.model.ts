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

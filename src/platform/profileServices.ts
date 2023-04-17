/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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
  USER_PROFILE_TYPE,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
  APP_PROFILE_TYPE,
  AUTH_SERVICE_USER_PROFILE_RELATION_NAME,
  AUTH_SERVICE_APP_PROFILE_RELATION_NAME,
} from '../constant';
import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';

import {
  IUserProfileCreationParams,
  IUserProfileUpdateParams,
  IUserProfile,
} from './userProfile.model';

import {
  IAppProfileCreationParams,
  IAppProfileUpdateParams,
  IAppProfile,
} from './appProfile.model';
import SpinalMiddleware from '../spinalMiddleware';

export class ProfileServices {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }

  public async createUserProfileService(
    userProfileCreationParms: IUserProfileCreationParams
  ): Promise<IUserProfile> {
    const platformContext = SpinalGraphService.getContext('platformList');

    const userProfileObject: IUserProfileCreationParams = {
      userProfileId: userProfileCreationParms.userProfileId,
      name: userProfileCreationParms.name,
      type: USER_PROFILE_TYPE,
      platformId: userProfileCreationParms.platformId,
    };
    const nodeUserId = SpinalGraphService.createNode(
      userProfileObject,
      undefined
    );
    const platforms = await platformContext.getChildren('HasPlatform');
    for (const platform of platforms) {
      if (platform.getId().get() === userProfileObject.platformId) {
        //@ts-ignore
        SpinalGraphService._addNode(platform);
        var res = await SpinalGraphService.addChildInContext(
          platform.getId().get(),
          nodeUserId,
          platformContext.getId().get(),
          AUTH_SERVICE_USER_PROFILE_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        );
      }
    }
    if (res !== undefined) {
      return {
        id: res.getId().get(),
        userProfileId: res.info.userProfileId.get(),
        name: res.getName().get(),
        type: res.getType().get(),
        platformId: res.info.platformId.get(),
      };
    }
  }

  public async createAppProfileService(
    appProfileCreationParms: IAppProfileCreationParams
  ): Promise<IAppProfile> {
    const platformContext = SpinalGraphService.getContext('platformList');

    const appProfileObject: IAppProfileCreationParams = {
      appProfileId: appProfileCreationParms.appProfileId,
      name: appProfileCreationParms.name,
      type: APP_PROFILE_TYPE,
      platformId: appProfileCreationParms.platformId,
    };
    const nodeAppId = SpinalGraphService.createNode(
      appProfileObject,
      undefined
    );
    const platforms = await platformContext.getChildren('HasPlatform');
    for (const platform of platforms) {
      if (platform.getId().get() === appProfileObject.platformId) {
        //@ts-ignore
        SpinalGraphService._addNode(platform);
        var res = await SpinalGraphService.addChildInContext(
          platform.getId().get(),
          nodeAppId,
          platformContext.getId().get(),
          AUTH_SERVICE_APP_PROFILE_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        );
      }
    }
    if (res !== undefined) {
      return {
        id: res.getId().get(),
        appProfileId: res.info.appProfileId.get(),
        name: res.getName().get(),
        type: res.getType().get(),
        platformId: res.info.platformId.get(),
      };
    }
  }

  public async getUserProfileService(
    platformId: string
  ): Promise<IUserProfile[]> {
    try {
      const platformContext = SpinalGraphService.getContext('platformList');
      var userProfileObjectList = [];
      const platforms = await platformContext.getChildren('HasPlatform');
      for (const platform of platforms) {
        if (platform.getId().get() === platformId) {
          //@ts-ignore
          SpinalGraphService._addNode(platform);
          var userProfileList = await platform.getChildren('HasUserProfile');
          for (const userProfile of userProfileList) {
            var UserProfileObject: IUserProfile = {
              id: userProfile.getId().get(),
              type: userProfile.getType().get(),
              name: userProfile.getName().get(),
              userProfileId: userProfile.info.userProfileId.get(),
              platformId: userProfile.info.platformId.get(),
            };
            userProfileObjectList.push(UserProfileObject);
          }
        }
      }
      return userProfileObjectList;
    } catch (error) {
      return error;
    }
  }

  public async getAppProfileService(
    platformId: string
  ): Promise<IAppProfile[]> {
    try {
      const platformContext = SpinalGraphService.getContext('platformList');
      var appProfileObjectList = [];
      const platforms = await platformContext.getChildren('HasPlatform');
      for (const platform of platforms) {
        if (platform.getId().get() === platformId) {
          //@ts-ignore
          SpinalGraphService._addNode(platform);
          var appProfileList = await platform.getChildren('HasAppProfile');
          for (const appProfile of appProfileList) {
            var AppProfileObject: IAppProfile = {
              id: appProfile.getId().get(),
              type: appProfile.getType().get(),
              name: appProfile.getName().get(),
              appProfileId: appProfile.info.appProfileId.get(),
              platformId: appProfile.info.platformId.get(),
            };
            appProfileObjectList.push(AppProfileObject);
          }
        }
      }
      return appProfileObjectList;
    } catch (error) {
      return error;
    }
  }
}

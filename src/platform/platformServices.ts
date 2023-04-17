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
  PLATFORM_LIST,
  AUTH_SERVICE_PLATFORM_RELATION_NAME,
  PLATFORM_TYPE,
  AUTH_SERVICE_RELATION_TYPE_PTR_LST,
  AUTH_SERVICE_ORGAN_RELATION_NAME,
  REGISTER_KEY_TYPE,
  INFO_ADMIN_TYPE,
  AUTH_SERVICE_INFO_ADMIN_RELATION_NAME,
  INFO_ADMIN,
} from '../constant';
import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import { OperationError } from '../utilities/operation-error';
import { HttpStatusCode } from '../utilities/http-status-code';
import {
  IPlatform,
  IPlateformCreationParams,
  IPlatformUpdateParams,
  statusPlatform,
  IRegisterParams,
  IRegisterKeyObject,
  IPlatformLogs
} from './platform.model';
import SpinalMiddleware from '../spinalMiddleware';
import { ProfileServices } from './profileServices';
import jwt = require('jsonwebtoken');

/**
 *
 *
 * @export
 * @class PlatformService
 */
export class PlatformService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  // public logService: LogsService;

  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
    // this.logService = new LogsService();
  }

  public async createPlateform(
    platformCreationParms: IPlateformCreationParams
  ): Promise<IPlatform> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platformObject: IPlateformCreationParams = {
          type: PLATFORM_TYPE,
          name: platformCreationParms.name,
          url: platformCreationParms.url,
          statusPlatform: platformCreationParms.statusPlatform,
          address: platformCreationParms.address,
          TokenBosAdmin: this.generateTokenBosAdmin(platformCreationParms.name),
          TokenAdminBos: '',
          idPlatformOfAdmin: '',
        };
        const PlatformId = SpinalGraphService.createNode(
          platformObject,
          undefined
        );
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          PlatformId,
          context.getId().get(),
          AUTH_SERVICE_PLATFORM_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        );
        // @ts-ignore
        SpinalGraphService._addNode(res);
        if (res === undefined) {
          // await this.logService.createLog(undefined, 'PlatformLogs', 'Register', 'Register Not Valid', "Register Not Valid");
          throw new OperationError('NOT_CREATED', HttpStatusCode.BAD_REQUEST);

        } else {
          // await this.logService.createLog(res, 'PlatformLogs', 'Register', 'Register Valid', "Register Valid");
          return {
            id: res.getId().get(),
            type: res.getType().get(),
            name: res.getName().get(),
            statusPlatform: res.info.statusPlatform.get(),
            url: res.info.url.get(),
            address: res.info.address.get(),
            TokenBosAdmin: res.info.TokenBosAdmin.get(),
          };
        }
      }
    }
  }

  public async getPlateform(id): Promise<IPlatform> {

    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          AUTH_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            var PlatformObject: IPlatform = {
              id: platform.getId().get(),
              type: platform.getType().get(),
              name: platform.getName().get(),
              statusPlatform: platform.info.statusPlatform.get(),
              url: platform.info.url.get(),
              address: platform.info.address?.get(),
              TokenBosAdmin: platform.info.TokenBosAdmin?.get(),
              TokenAdminBos: platform.info.TokenAdminBos?.get(),
              idPlatformOfAdmin: platform.info.idPlatformOfAdmin?.get(),
            };
          }
        }
      }
    }

    if (PlatformObject) {
      return PlatformObject;
    } else {
      throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }
  }
  public async getPlateforms(): Promise<IPlatform[]> {

    try {
      var platformObjectList = [];
      const contexts = await this.graph.getChildren('hasContext');
      for (const context of contexts) {
        if (context.getName().get() === PLATFORM_LIST) {
          const platforms = await context.getChildren(
            AUTH_SERVICE_PLATFORM_RELATION_NAME
          );

          for (const platform of platforms) {
            var PlatformObject: IPlatform = {
              id: platform.getId().get(),
              type: platform.getType().get(),
              name: platform.getName().get(),
              statusPlatform: platform.info.statusPlatform?.get(),
              url: platform.info.url?.get(),
              address: platform.info.address?.get(),
              TokenBosAdmin: platform.info.TokenBosAdmin?.get(),
              TokenAdminBos: platform.info.TokenAdminBos?.get(),
              idPlatformOfAdmin: platform.info.idPlatformOfAdmin?.get(),
            };
            platformObjectList.push(PlatformObject);
          }
        }
      }
      return platformObjectList;
    } catch (error) {
      return error;
    }
  }
  public async updatePlateform(
    id: string,
    requestBody: IPlatformUpdateParams
  ): Promise<IPlatform> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          AUTH_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === id) {

            if (requestBody.name !== undefined) {
              platform.info.name.set(requestBody.name);
            }
            if (requestBody.statusPlatform !== undefined) {
              platform.info.statusPlatform.set(requestBody.statusPlatform);
            }
            if (requestBody.url !== undefined) {
              platform.info.url.set(requestBody.url);
            }
            if (requestBody.address !== undefined) {
              platform.info.address?.set(requestBody.address);
            }
            if (requestBody.TokenBosAdmin !== undefined) {
              platform.info.TokenBosAdmin?.set(requestBody.TokenBosAdmin);
            }
            // await this.logService.createLog(platform, 'PlatformLogs', 'Edit', 'Edit Valid', "Edit Valid");
            return {
              id: platform.getId().get(),
              type: platform.getType().get(),
              name: platform.getName().get(),
              statusPlatform: platform.info.statusPlatform.get(),
              url: platform.info.url.get(),
              address: platform.info.address?.get(),
              TokenBosAdmin: platform.info.TokenBosAdmin?.get(),
              TokenAdminBos: platform.info.TokenAdminBos?.get(),
              idPlatformOfAdmin: platform.info.idPlatformOfAdmin?.get(),
            };
          }
        }
      }
    }
  }

  public async deletePlatform(id: string): Promise<void> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          AUTH_SERVICE_PLATFORM_RELATION_NAME
        );
        var platformFound: SpinalNode<any>
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            platformFound = platform;
          }
        }

        if (platformFound !== undefined) {
          // await this.logService.createLog(platformFound, 'PlatformLogs', 'Delete', 'Delete Valid', "Delete Valid");
          await platformFound.removeFromGraph();
        } else {
          // await this.logService.createLog(undefined, 'PlatformLogs', 'Delete', 'Delete Not Valid', "Delete Not Valid");
          throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
        }
      }
    }

  }

  public async createAuthPlateform(): Promise<IPlatform> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        // @ts-ignore
        SpinalGraphService._addNode(context);
        const platformObject: IPlateformCreationParams = {
          name: 'authenticationPlatform',
          type: PLATFORM_TYPE,
          statusPlatform: statusPlatform.online,
          url: process.env.SPINALHUB_URL,
          TokenBosAdmin: this.generateTokenBosAdmin('authenticationPlatform'),
          address: '',
          TokenAdminBos: '',
          idPlatformOfAdmin: '',
        };
        const PlatformId = SpinalGraphService.createNode(
          platformObject,
          undefined
        );
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          PlatformId,
          context.getId().get(),
          AUTH_SERVICE_PLATFORM_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        );
        if (res === undefined) {
          // await this.logService.createLog(undefined, 'PlatformLogs', 'Register', 'Register Not Valid', "Register Not Valid");
          throw new OperationError('NOT_CREATED', HttpStatusCode.BAD_REQUEST);

        } else {
          // await this.logService.createLog(res, 'PlatformLogs', 'Register', 'Register Valid', "Register Valid AuthPlatform created");
          return {
            id: res.getId().get(),
            type: res.getType().get(),
            name: res.getName().get(),
            statusPlatform: res.info.statusPlatform.get(),
            url: res.info.url?.get(),
          };
        }

      }
    }
  }

  public async createRegisterKeyNode(): Promise<IRegisterKeyObject> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === 'infoAdmin') {
        // @ts-ignore
        SpinalGraphService._addNode(context);
        const registerKeyObject = {
          name: 'registerKey',
          type: REGISTER_KEY_TYPE,
          value: this.generateRegisterKey(),
        };
        const regesterKeyId = SpinalGraphService.createNode(
          registerKeyObject,
          undefined
        );
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          regesterKeyId,
          context.getId().get(),
          AUTH_SERVICE_INFO_ADMIN_RELATION_NAME,
          AUTH_SERVICE_RELATION_TYPE_PTR_LST
        );
        return {
          id: res.getId().get(),
          type: res.getType().get(),
          name: res.getName().get(),
          value: res.info.value.get(),
        };
      }
    }
  }
  public generateRegisterKey() {
    const generator = require('generate-password');
    var registerKey = generator.generate({
      length: 20,
      numbers: true,
    });
    return registerKey;
  }

  public async updateRegisterKeyNode(): Promise<IRegisterKeyObject> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === INFO_ADMIN) {
        // @ts-ignore
        SpinalGraphService._addNode(context);
        const childrens = await context.getChildren(
          AUTH_SERVICE_INFO_ADMIN_RELATION_NAME
        );
        for (const child of childrens) {
          if (child.getName().get() === 'registerKey') {
            child.info.value.set(this.generateRegisterKey());
            return {
              id: child.getId().get(),
              type: child.getType().get(),
              name: child.getName().get(),
              value: child.info.value.get(),
            };
          }
        }
      }
    }
  }

  public async getRegisterKeyNode(): Promise<IRegisterKeyObject> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === INFO_ADMIN) {
        // @ts-ignore
        SpinalGraphService._addNode(context);
        const childrens = await context.getChildren(
          AUTH_SERVICE_INFO_ADMIN_RELATION_NAME
        );
        for (const child of childrens) {
          if (child.getName().get() === 'registerKey') {
            return {
              id: child.getId().get(),
              type: child.getType().get(),
              name: child.getName().get(),
              value: child.info.value.get(),
            };
          }
        }
      }
    }
  }

  public generateTokenBosAdmin(platformName: string) {
    const dotenv = require('dotenv');
    dotenv.config();
    let token = jwt.sign(
      { platformName: platformName },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '24h',
      }
    );
    // let decodedToken = jwt_decode(token);
    return token;
  }

  public async registerNewPlatform(
    object: IRegisterParams
  ): Promise<IPlatform | string> {
    const contexts = await this.graph.getChildren('hasContext');
    var registerKey: string;
    for (const context of contexts) {
      if (context.getName().get() === INFO_ADMIN) {
        const childrens = await context.getChildren(
          AUTH_SERVICE_INFO_ADMIN_RELATION_NAME
        );
        registerKey = childrens[0].info.value.get();
      }
    }
    if (object.registerKey === registerKey) {
      const res = await this.createPlateform(object.platformCreationParms);
      return res;
    } else {
      // await this.logService.createLog(undefined, 'PlatformLogs', 'Register', 'Register Not Valid', "registerKey Not Valid");
      throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }
  }

  public async updateNewPlatform(updateParams) {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platformList = await context.getChildren('HasPlatform');
        for (const platform of platformList) {
          // @ts-ignore
          SpinalGraphService._addNode(platform);
          if (platform.getId().get() === updateParams.platformId) {
            if (
              platform.info.TokenBosAdmin.get() === updateParams.TokenBosAdmin
            ) {
              if (updateParams.jsonData) {
                //update the old Organ List
                const oldOrgans = await platform.getChildren('HasOrgan');
                await updateOrganProfile(oldOrgans, platform, updateParams.jsonData.organList);
                // update th old user Profiles
                const oldUserProfileList = await platform.getChildren('HasUserProfile');
                await updateAppUserProfile(oldUserProfileList, platform, updateParams.jsonData.userProfileList, "userProfile")

                // update the old app profiles
                const oldAppProfileList = await platform.getChildren('HasAppProfile');
                await updateAppUserProfile(oldAppProfileList, platform, updateParams.jsonData.appProfileList, "appProfile")

                platform.info.idPlatformOfAdmin.set(
                  updateParams.idPlatformOfAdmin
                );
                platform.info.TokenAdminBos.set(updateParams.TokenAdminBos);
                // await this.logService.createLog(platform, 'PlatformLogs', 'PushData', 'Push Data', "Push Data Valid ");
              }
            } else {
              // await this.logService.createLog(platform, 'PlatformLogs', 'PushData', 'Push Data Not Valid', "Push Data Not Valid Empty Json Data");
              throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
            }

          }
        }
      }
    }
  }

  public async getPlateformLogs(id: string): Promise<IPlatformLogs[]> {
    var logArrayList: IPlatformLogs[] = [];
    var found: boolean = false;
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          AUTH_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            found = true;
            const logs = await platform.getChildren('HasLog');
            for (const log of logs) {
              var PlatformObjectLog: IPlatformLogs = {
                id: log.getId().get(),
                type: log.getType().get(),
                name: log.getName().get(),
                date: log.info.date.get(),
                message: log.info.message.get(),
                actor: {
                  actorId: log.info.actor.actorId.get(),
                  actorName: log.info.actor.actorName.get()
                }
              }
              logArrayList.push(PlatformObjectLog)
            }

          }
        }
      }
    }

    if (found === true) {
      return logArrayList;
    } else {
      throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }
  }
}
async function updateOrganProfile(oldOrgans: SpinalNode<any>[], platform: SpinalNode<any>, newList: any[]) {
  var arrayDelete = [];
  var arrayCreate = [];
  for (const oldOrgan of oldOrgans) {
    const resSome = newList.some(it => {
      return it.label === oldOrgan.getName().get();
    });
    if (resSome === false) {
      arrayDelete.push(oldOrgan);
    }
  }
  for (const newOrgan of newList) {
    const resSome = oldOrgans.some(it => {
      return it.getName().get() === newOrgan.label;
    });

    if (resSome === false) {
      arrayCreate.push(newOrgan);
    }
  }
  for (const organ of arrayDelete) {
    await organ.removeFromGraph();
  }
  // const organService = new OrganService();
  // for (const organ of arrayCreate) {
  //   organService.createOrgan({
  //     name: organ.label,
  //     organType: organ.type,
  //     statusOrgan: 'online',
  //     platformId: platform.getId().get(),
  //   });
  // }
}

async function updateAppUserProfile(oldList: SpinalNode<any>[], platform: SpinalNode<any>, newList: any[], type: string) {
  const profileServices = new ProfileServices();

  var arrayDelete = [];
  var arrayCreate = [];
  if (type === "userProfile") {
    for (const olditem of oldList) {
      const resSome = newList.some(it => {
        return it.userProfileId === olditem.info.userProfileId.get();
      });
      if (resSome === false) {
        arrayDelete.push(olditem);
      }
    }
    for (const newItem of newList) {
      const resSome = oldList.some(it => {
        return it.info.userProfileId.get() === newItem.userProfileId;
      });

      if (resSome === false) {
        arrayCreate.push(newItem);
      }
    }
    for (const item of arrayDelete) {
      await item.removeFromGraph();
    }

    for (const item of arrayCreate) {
      profileServices.createUserProfileService({
        userProfileId: item.userProfileId,
        name: item.label,
        platformId: platform.getId().get(),
      })
    }



  } else if (type === "appProfile") {

    for (const olditem of oldList) {
      const resSome = newList.some(it => {
        return it.appProfileId === olditem.info.appProfileId.get();
      });
      if (resSome === false) {
        arrayDelete.push(olditem);
      }
    }
    for (const newItem of newList) {
      const resSome = oldList.some(it => {
        return it.info.appProfileId.get() === newItem.appProfileId;
      });

      if (resSome === false) {
        arrayCreate.push(newItem);
      }
    }
    for (const item of arrayDelete) {
      await item.removeFromGraph();
    }
    for (const item of arrayCreate) {
      profileServices.createAppProfileService({
        appProfileId: item.appProfileId,
        name: item.label,
        platformId: platform.getId().get(),
      });
    }
  }
}


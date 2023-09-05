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
  MONITORING_SERVICE_PLATFORM_RELATION_NAME,
  PLATFORM_TYPE,
  MONITORING_SERVICE_RELATION_TYPE_PTR_LST,
  MONITORING_SERVICE_ORGAN_RELATION_NAME,
  REGISTER_KEY_TYPE,
  INFO_MONITORING_TYPE,
  MONITORING_SERVICE_INFO_RELATION_NAME,
  INFO_MONITORING,
  CATEGORY_NAME
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
  IRegisterParams,
  IRegisterKeyObject,
  IPlatformLogs
} from './platform.model';
import serviceDocumentation from "spinal-env-viewer-plugin-documentation-service"
import SpinalMiddleware from '../spinalMiddleware';
import jwt = require('jsonwebtoken');
import { OrganService } from '../organ/organService'
import { InputDataEndpoint, InputDataEndpointDataType, InputDataEndpointType } from 'spinal-model-bmsnetwork';
import getInstance from '../utilities/NetworkService';

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
        const platformObject = {
          type: PLATFORM_TYPE,
          name: platformCreationParms.name,
          platformType: platformCreationParms.platformType,
          TokenBosRegister: this.generateTokenBosAdmin(platformCreationParms.name),
          ipAdress: platformCreationParms.ipAdress,
          url: platformCreationParms.url,
          loginAdmin: platformCreationParms.loginAdmin,
          passwordAdmin: platformCreationParms.passwordAdmin,
          [Symbol.iterator]: function* () {
            let properties = Object.keys(this);
            for (let i of properties) {
              yield [i, this[i]];
            }
          }
        };
        const PlatformId = SpinalGraphService.createNode(
          platformObject,
          undefined
        );
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          PlatformId,
          context.getId().get(),
          MONITORING_SERVICE_PLATFORM_RELATION_NAME,
          MONITORING_SERVICE_RELATION_TYPE_PTR_LST
        );
        // @ts-ignore
        SpinalGraphService._addNode(res);
        const category = await serviceDocumentation.addCategoryAttribute(res, CATEGORY_NAME)
        for (const [key, value] of platformObject) {
          await serviceDocumentation.addAttributeByCategoryName(res, category.nameCat, key, value)
        }
        if (res === undefined) {
          throw new OperationError('NOT_CREATED', HttpStatusCode.BAD_REQUEST);
        }
        const organHub = await new OrganService().createHubOrgan(platformCreationParms.hubOrgan, PlatformId);
        if (organHub === undefined) {
          await res.removeFromGraph();
          throw new OperationError('HUB_NOT_CREATED', HttpStatusCode.BAD_REQUEST);
        }
        // if (platformCreationParms.organList.length !== 0) {
        //   for (const organ of platformCreationParms.organList) {
        //     await SpinalGraphService.addChild(res.getId().get(), organ.organId, 'HasOrgan', MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
        //   }
        // }

        const errorHistory: InputDataEndpoint = {
          id: "0",
          name: "error_history",
          path: "",
          currentValue: 0,
          unit: 'timestamp',
          nodeTypeName: 'BmsEndpoint',
          dataType: InputDataEndpointDataType.Date,
          type: InputDataEndpointType.Other,
        };
        await getInstance().createNewBmsEndpointWithoutContext(PlatformId, errorHistory);

        // let _organList = []
        // const _organs = await res.getChildren('HasOrgan')
        // for (const _organ of _organs) {
        //   var _organObject = {
        //     id: _organ.getId().get(),
        //     name: _organ.getName().get(),
        //   }
        //   _organList.push(_organObject);
        // }
        return {
          id: res.getId().get(),
          type: res.getType().get(),
          name: res.getName().get(),
          TokenBosRegister: res.info.TokenBosRegister.get(),
          platformType: res.info.platformType.get(),
          ipAdress: res.info.ipAdress.get(),
          url: res.info.url.get(),
          loginAdmin: res.info.loginAdmin.get(),
          passwordAdmin: res.info.passwordAdmin.get(),
        };

      }
    }
  }

  public async getPlateform(id: string): Promise<any> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          MONITORING_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            const organList = await platform.getChildren('HasOrgan');
            let _organList = [];
            if (organList.length !== 0) {
              for (const organ of organList) {
                let infoOrgan = {
                  id: organ.getId(),
                  name: organ.getName(),
                }
                _organList.push(infoOrgan);
              }
            }
            var PlatformObject: IPlatform = {
              id: platform.getId().get(),
              type: platform.getType().get(),
              name: platform.getName().get(),
              TokenBosRegister: platform.info.TokenBosRegister.get(),
              url: platform.info.url.get(),
              ipAdress: platform.info.ipAdress.get(),
              loginAdmin: platform.info.loginAdmin.get(),
              passwordAdmin: platform.info.passwordAdmin.get(),
              platformType: platform.info.platformType.get(),
              organList: _organList
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
    var platformObjectList = [];
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          MONITORING_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          const organList = await platform.getChildren('HasOrgan');
          let _organList = [];
          if (organList.length !== 0) {
            for (const organ of organList) {
              let infoOrgan = {
                id: organ.getId(),
                name: organ.getName(),
              }
              _organList.push(infoOrgan);
            }
          }
          var PlatformObject: IPlatform = {
            id: platform.getId().get(),
            type: platform.getType().get(),
            name: platform.getName().get(),
            TokenBosRegister: platform.info.TokenBosRegister.get(),
            url: platform.info.url.get(),
            ipAdress: platform.info.ipAdress.get(),
            loginAdmin: platform.info.loginAdmin.get(),
            passwordAdmin: platform.info.passwordAdmin.get(),
            platformType: platform.info.platformType.get(),
            organList: _organList
          };
          platformObjectList.push(PlatformObject);
        }
      }
    }
    if (platformObjectList) {
      return platformObjectList;
    } else {
      throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }
  }
  public async updatePlatform(
    id: string,
    requestBody: IPlatformUpdateParams
  ): Promise<any> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          MONITORING_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            const attrs = await serviceDocumentation.getAttributesByCategory(platform, CATEGORY_NAME);
            for (const attr of attrs) {
              if (attr.label.get() === 'name') serviceDocumentation.setAttributeById(platform, attr._server_id, 'name', requestBody.name, attr.type.get(), attr.unit.get())
              else if (attr.label.get() === 'platformType') serviceDocumentation.setAttributeById(platform, attr._server_id, 'platformType', requestBody.platformType, attr.type.get(), attr.unit.get())
              else if (attr.label.get() === 'ipAdress') serviceDocumentation.setAttributeById(platform, attr._server_id, 'ipAdress', requestBody.ipAdress, attr.type.get(), attr.unit.get())
              else if (attr.label.get() === 'url') serviceDocumentation.setAttributeById(platform, attr._server_id, 'url', requestBody.url, attr.type.get(), attr.unit.get())
              else if (attr.label.get() === 'loginAdmin') serviceDocumentation.setAttributeById(platform, attr._server_id, 'loginAdmin', requestBody.loginAdmin, attr.type.get(), attr.unit.get())
              else if (attr.label.get() === 'passwordAdmin') serviceDocumentation.setAttributeById(platform, attr._server_id, 'passwordAdmin', requestBody.passwordAdmin, attr.type.get(), attr.unit.get())
            }
            const organList = await platform.getChildren('HasOrgan');
            let _organList = [];
            if (organList.length !== 0) {
              for (const organ of organList) {
                let infoOrgan = {
                  id: organ.getId(),
                  name: organ.getName(),
                }
                _organList.push(infoOrgan);
              }
            }

            // await this.logService.createLog(platform, 'PlatformLogs', 'Edit', 'Edit Valid', "Edit Valid");
            return {
              id: platform.getId().get(),
              type: platform.getType().get(),
              name: platform.getName().get(),
              TokenBosRegister: platform.info.TokenBosRegister.get(),
              url: platform.info.url.get(),
              ipAdress: platform.info.ipAdress.get(),
              loginAdmin: platform.info.loginAdmin.get(),
              passwordAdmin: platform.info.passwordAdmin.get(),
              platformType: platform.info.platformType.get(),
              organList: _organList
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
          MONITORING_SERVICE_PLATFORM_RELATION_NAME
        );
        var platformFound: SpinalNode<any>
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            if (platform.getName().get() === "monitoringPlatform") {
              throw new OperationError('UNAUTHORIZED ROLE', HttpStatusCode.FORBIDDEN);
            } else {
              platformFound = platform;
            }
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

  // public async createOrUpdateMonitoringPlateform(): Promise<IPlatform> {

  //   const contexts = await this.graph.getChildren('hasContext');
  //   for (const context of contexts) {
  //     if (context.getName().get() === PLATFORM_LIST) {
  //       // @ts-ignore
  //       SpinalGraphService._addNode(context);
  //       const platformObject: IPlateformCreationParams = {
  //         name: 'monitoringPlatform',
  //         type: PLATFORM_TYPE,
  //         statusPlatform: statusPlatform.online,
  //         TokenBosRegister: "",
  //         infoHub: {
  //           ip: process.env.SPINALHUB_IP,
  //           port: parseInt(process.env.SPINALHUB_PORT),
  //           url: process.env.SPINALHUB_URL,
  //           login: process.env.MONITORING_ADMIN_EMAIL,
  //           password: process.env.MONITORING_ADMIN_PASSWORD,
  //         },
  //         infoWall: {
  //           ip: "",
  //           port: 0,
  //           url: "",
  //           login: "",
  //           password: "",
  //         },
  //         organList: []
  //       };
  //       const PlatformId = SpinalGraphService.createNode(
  //         platformObject,
  //         undefined
  //       );
  //       const res = await SpinalGraphService.addChildInContext(
  //         context.getId().get(),
  //         PlatformId,
  //         context.getId().get(),
  //         MONITORING_SERVICE_PLATFORM_RELATION_NAME,
  //         MONITORING_SERVICE_RELATION_TYPE_PTR_LST
  //       );
  //       if (res === undefined) {
  //         // await this.logService.createLog(undefined, 'PlatformLogs', 'Register', 'Register Not Valid', "Register Not Valid");
  //         throw new OperationError('NOT_CREATED', HttpStatusCode.BAD_REQUEST);

  //       } else {
  //         // await this.logService.createLog(res, 'PlatformLogs', 'Register', 'Register Valid', "Register Valid AuthPlatform created");
  //         return {
  //           id: res.getId().get(),
  //           type: res.getType().get(),
  //           name: res.getName().get(),
  //           statusPlatform: res.info.statusPlatform.get(),
  //           infoHub: {
  //             ip: res.info.infoHub.ip.get(),
  //             port: res.info.infoHub.port.get(),
  //             url: res.info.infoHub.url.get(),
  //             login: res.info.infoHub.login.get(),
  //             password: res.info.infoHub.password.get(),
  //           },
  //           infoWall: {
  //             ip: res.info.infoWall.ip.get(),
  //             port: res.info.infoWall.port.get(),
  //             url: res.info.infoWall.url.get(),
  //             login: res.info.infoWall.login.get(),
  //             password: res.info.infoWall.password.get(),
  //           }
  //         };
  //       }
  //     }
  //   }
  // }

  public async createRegisterKeyNode(): Promise<IRegisterKeyObject> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === 'infoMonitoring') {
        // @ts-ignore
        SpinalGraphService._addNode(context);
        const registerKeyObject = {
          name: 'registerKey',
          type: REGISTER_KEY_TYPE,
          value: this.generateRegisterKey(),
          [Symbol.iterator]: function* () {
            let properties = Object.keys(this);
            for (let i of properties) {
              yield [i, this[i]];
            }
          }
        };
        const regesterKeyId = SpinalGraphService.createNode(
          registerKeyObject,
          undefined
        );
        const res = await SpinalGraphService.addChildInContext(
          context.getId().get(),
          regesterKeyId,
          context.getId().get(),
          MONITORING_SERVICE_INFO_RELATION_NAME,
          MONITORING_SERVICE_RELATION_TYPE_PTR_LST
        );

        const category = await serviceDocumentation.addCategoryAttribute(res, CATEGORY_NAME)
        for (const [key, value] of registerKeyObject) {
          await serviceDocumentation.addAttributeByCategoryName(res, category.nameCat, key, value)
        }
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
      if (context.getName().get() === INFO_MONITORING) {
        // @ts-ignore
        SpinalGraphService._addNode(context);
        const childrens = await context.getChildren(
          MONITORING_SERVICE_INFO_RELATION_NAME
        );
        for (const child of childrens) {
          if (child.getName().get() === 'registerKey') {
            const newValue = this.generateRegisterKey()
            child.info.value.set(newValue);
            const attrs = await serviceDocumentation.getAttributesByCategory(child, CATEGORY_NAME);
            for (const attr of attrs) {
              if (attr.label.get() === 'value') serviceDocumentation.setAttributeById(child, attr._server_id, 'value', newValue, attr.type.get(), attr.unit.get())
            }
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
      if (context.getName().get() === INFO_MONITORING) {
        // @ts-ignore
        SpinalGraphService._addNode(context);
        const childrens = await context.getChildren(
          MONITORING_SERVICE_INFO_RELATION_NAME
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
      if (context.getName().get() === INFO_MONITORING) {
        const childrens = await context.getChildren(
          MONITORING_SERVICE_INFO_RELATION_NAME
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

  // public async updatePlatform(updateParams) {
  //   const contexts = await this.graph.getChildren('hasContext');
  //   for (const context of contexts) {
  //     if (context.getName().get() === PLATFORM_LIST) {
  //       const platformList = await context.getChildren('HasPlatform');
  //       for (const platform of platformList) {
  //         // @ts-ignore
  //         SpinalGraphService._addNode(platform);
  //         if (platform.getId().get() === updateParams.platformId) {
  //           if (
  //             platform.info.TokenBosAdmin.get() === updateParams.TokenBosAdmin
  //           ) {
  //             if (updateParams.jsonData) {
  //               //update the old Organ List
  //               const oldOrgans = await platform.getChildren('HasOrgan');
  //               // await updateOrganProfile(oldOrgans, platform, updateParams.jsonData.organList);
  //               // update th old user Profiles
  //               const oldUserProfileList = await platform.getChildren('HasUserProfile');
  //               // await updateAppUserProfile(oldUserProfileList, platform, updateParams.jsonData.userProfileList, "userProfile")

  //               // update the old app profiles
  //               const oldAppProfileList = await platform.getChildren('HasAppProfile');
  //               // await updateAppUserProfile(oldAppProfileList, platform, updateParams.jsonData.appProfileList, "appProfile")

  //               platform.info.idPlatformOfAdmin.set(
  //                 updateParams.idPlatformOfAdmin
  //               );
  //               platform.info.TokenAdminBos.set(updateParams.TokenAdminBos);
  //               // await this.logService.createLog(platform, 'PlatformLogs', 'PushData', 'Push Data', "Push Data Valid ");
  //             }
  //           } else {
  //             // await this.logService.createLog(platform, 'PlatformLogs', 'PushData', 'Push Data Not Valid', "Push Data Not Valid Empty Json Data");
  //             throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
  //           }

  //         }
  //       }
  //     }
  //   }
  // }

  public async getPlateformLogs(id: string): Promise<IPlatformLogs[]> {
    var logArrayList: IPlatformLogs[] = [];
    var found: boolean = false;
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          MONITORING_SERVICE_PLATFORM_RELATION_NAME
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
// async function updateOrganProfile(oldOrgans: SpinalNode<any>[], platform: SpinalNode<any>, newList: any[]) {
//   var arrayDelete = [];
//   var arrayCreate = [];
//   for (const oldOrgan of oldOrgans) {
//     const resSome = newList.some(it => {
//       return it.label === oldOrgan.getId().get();
//     });
//     if (resSome === false) {
//       arrayDelete.push(oldOrgan);
//     }
//   }
//   for (const newOrgan of newList) {
//     const resSome = oldOrgans.some(it => {
//       return it.getId().get() === newOrgan.label;
//     });

//     if (resSome === false) {
//       arrayCreate.push(newOrgan);
//     }
//   }
//   for (const organ of arrayDelete) {
//     await organ.removeFromGraph();
//   }
//   const organService = new OrganService();
//   for (const organ of arrayCreate) {
//     organService.createOrgan({
//       name: organ.label,
//       organType: organ.type,
//       statusOrgan: 'online',
//       platformId: platform.getId().get(),
//     });
//   }
// }

// async function updateAppUserProfile(oldList: SpinalNode<any>[], platform: SpinalNode<any>, newList: any[], type: string) {
//   const profileServices = new ProfileServices();

//   var arrayDelete = [];
//   var arrayCreate = [];
//   if (type === "userProfile") {
//     for (const olditem of oldList) {
//       const resSome = newList.some(it => {
//         return it.userProfileId === olditem.info.userProfileId.get();
//       });
//       if (resSome === false) {
//         arrayDelete.push(olditem);
//       }
//     }
//     for (const newItem of newList) {
//       const resSome = oldList.some(it => {
//         return it.info.userProfileId.get() === newItem.userProfileId;
//       });

//       if (resSome === false) {
//         arrayCreate.push(newItem);
//       }
//     }
//     for (const item of arrayDelete) {
//       await item.removeFromGraph();
//     }

//     for (const item of arrayCreate) {
//       profileServices.createUserProfileService({
//         userProfileId: item.userProfileId,
//         name: item.label,
//         platformId: platform.getId().get(),
//       })
//     }



//   } else if (type === "appProfile") {

//     for (const olditem of oldList) {
//       const resSome = newList.some(it => {
//         return it.appProfileId === olditem.info.appProfileId.get();
//       });
//       if (resSome === false) {
//         arrayDelete.push(olditem);
//       }
//     }
//     for (const newItem of newList) {
//       const resSome = oldList.some(it => {
//         return it.info.appProfileId.get() === newItem.appProfileId;
//       });

//       if (resSome === false) {
//         arrayCreate.push(newItem);
//       }
//     }
//     for (const item of arrayDelete) {
//       await item.removeFromGraph();
//     }
//     for (const item of arrayCreate) {
//       profileServices.createAppProfileService({
//         appProfileId: item.appProfileId,
//         name: item.label,
//         platformId: platform.getId().get(),
//       });
//     }
//   }
// }


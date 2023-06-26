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
  USER_LIST,
  MONITORING_SERVICE_USER_RELATION_NAME,
  USER_TYPE,
  MONITORING_SERVICE_RELATION_TYPE_PTR_LST,
  TOKEN_TYPE,
  TOKEN_LIST,
  MONITORING_SERVICE_TOKEN_RELATION_NAME,
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
  IUser,
  IUserType,
  IUserCreationParams,
  IUserUpdateParams,
  IUserLoginParams,
  IUserLogs
} from './user.model';
import { IUserToken } from '../tokens/token.model';
import config from '../config';
import SpinalMiddleware from '../spinalMiddleware';
// import { LogsService } from '../logs/logService';
import data from './profileUserListData';
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');
import jwt_decode from 'jwt-decode';
/**
 * @export
 * @class UserService
 */
export class UserService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  // public logService: LogsService;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
    // this.logService = new LogsService();

  }



  public async createUser(
    userCreationParams: IUserCreationParams
  ): Promise<IUser> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        const users = await context.getChildren('HasUser');
        for (const user of users) {
          if (user.info.email.get() === userCreationParams.email) {
            // await this.logService.createLog(user, 'UserLogs', 'Create', 'Create Not Valid', "create a new user with this userName");
            throw new OperationError(
              'EMAIL_IN_USE',
              HttpStatusCode.FORBIDDEN
            );
          }
        }
        var userNode: SpinalNode<any> = bcrypt
          .hash(userCreationParams.password, 10)
        console.log(userNode);

        // .then(async (hash) => {
        //   const userObject = {
        //     type: USER_TYPE,
        //     name: userCreationParams.email,
        //     email: userCreationParams.email,
        //     userType: userCreationParams.userType,
        //     password: hash,
        //   };
        //   if (userObject.userType !== 'MonitoringAdmin') {
        //     const UserId = SpinalGraphService.createNode(
        //       userObject,
        //       undefined
        //     );

        //     const res = await SpinalGraphService.addChildInContext(
        //       context.getId().get(),
        //       UserId,
        //       context.getId().get(),
        //       MONITORING_SERVICE_USER_RELATION_NAME,
        //       MONITORING_SERVICE_RELATION_TYPE_PTR_LST
        //     );
        //     return res
        //   } else {
        //     return undefined;
        //   }
        // });

        const userCreated = userNode;
        console.log("userCreated", await userCreated);

        if (userCreated === undefined) {
          // await this.logService.createLog(userCreated, 'UserLogs', 'Create', 'Create Not Valid', "Create Not Valid");
          throw new OperationError('NOT_CREATED', HttpStatusCode.BAD_REQUEST);
        } else {
          // await this.logService.createLog(userCreated, 'UserLogs', 'Create', 'Create Valid', "Create Valid");
          return {
            id: userCreated.getId().get(),
            type: userCreated.getType().get(),
            name: userCreated.getName().get(),
            email: userCreated.info.email.get(),
            password: userCreated.info.password.get(),
            userType: userCreated.info.userType.get(),
          };;
        }
      }
    }
  }

  public async login(userLoginParams: IUserLoginParams): Promise<IUserToken> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        const users = await context.getChildren(
          MONITORING_SERVICE_USER_RELATION_NAME
        );
        for (const user of users) {
          if (userLoginParams.email === user.info.email.get()) {
            return bcrypt
              .compare(userLoginParams.password, user.info.password.get())
              .then(async (valid) => {
                if (!valid) {
                  // await this.logService.createLog(user, 'UserLogs', 'Connection', 'User Valid Unknown Password', "User Valid Unknown Password");
                  throw new OperationError(
                    'NOT_FOUND',
                    HttpStatusCode.NOT_FOUND
                  );
                } else {
                  let token = jwt.sign(
                    { userId: user.getId().get() },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '1h' }
                  );
                  let decodedToken = jwt_decode(token);
                  const tokenContext = SpinalGraphService.getContext(
                    TOKEN_LIST
                  );
                  const categoryTokenUserList = await tokenContext.getChildren(
                    'HasCategoryToken'
                  );
                  for (const categoryTokenUser of categoryTokenUserList) {
                    // @ts-ignore
                    SpinalGraphService._addNode(categoryTokenUser);
                    if (
                      categoryTokenUser.getType().get() ===
                      'MonitoringServiceUserCategory'
                    ) {

                      // var platformList = [];
                      // const userProfiles = await user.getChildren('HasUserProfile');
                      // for (const userProfile of userProfiles) {
                      //   const platformParents = await userProfile.getParents('HasUserProfile')
                      //   for (const platformParent of platformParents) {
                      //     if (platformParent !== undefined) {
                      //       if (platformParent.getType().get() === "MonitoringServicePlatform") {
                      //         platformList.push({
                      //           platformId: platformParent.getId().get(),
                      //           platformName: platformParent.getName().get(),
                      //           idPlatformOfAdmin: platformParent.info.idPlatformOfAdmin?.get(),
                      //           userProfile: {
                      //             userProfileAdminId: userProfile.getId().get(),
                      //             userProfileBosConfigId: userProfile.info.userProfileId.get(),
                      //             userProfileName: userProfile.getName().get()
                      //           }
                      //         })
                      //       }
                      //     }
                      //   }
                      // }


                      const TokenId = SpinalGraphService.createNode(
                        {
                          name: 'token_' + user.getName().get(),
                          type: TOKEN_TYPE,
                          token: token,
                          // @ts-ignore
                          createdToken: decodedToken.iat,
                          // @ts-ignore
                          expieredToken: decodedToken.exp,
                          userId: user.getId().get(),
                        },
                        undefined
                      );
                      const res = await SpinalGraphService.addChildInContext(
                        categoryTokenUser.getId().get(),
                        TokenId,
                        tokenContext.getId().get(),
                        MONITORING_SERVICE_TOKEN_RELATION_NAME,
                        MONITORING_SERVICE_RELATION_TYPE_PTR_LST
                      );
                      let tokenObj: IUserToken = {
                        name: res.getName().get(),
                        token: token,
                        // @ts-ignore
                        createdToken: decodedToken.iat,
                        // @ts-ignore
                        expieredToken: decodedToken.exp,
                        userId: user.getId().get(),
                      };
                      // await this.logService.createLog(user, 'UserLogs', 'Connection', 'Login Valid', "Login Valid");
                      return tokenObj;
                    }
                  }
                }
              });
          }
        }
        // await this.logService.createLog(undefined, 'UserLogs', 'Connection', 'User Not Valid', "User Not Valid");
        throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
      }
    }
  }

  public async loginMonitoringAdmin(
    userLoginParams: IUserLoginParams
  ): Promise<IUserToken> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        const users = await context.getChildren(
          MONITORING_SERVICE_USER_RELATION_NAME
        );
        for (const user of users) {
          if (userLoginParams.email === user.info.email.get() && user.info.userType.get() === "MonitoringAdmin") {
            return bcrypt
              .compare(userLoginParams.password, user.info.password.get())
              .then(async (valid) => {
                if (!valid) {
                  // await this.logService.createLog(user, 'AdminLogs', 'Connection', 'Connection Not Valid', " Unknown AuthAdmin Password");
                  throw new OperationError(
                    'NOT_FOUND',
                    HttpStatusCode.NOT_FOUND
                  );
                } else {
                  let token = jwt.sign(
                    { userId: user.getId().get() },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                  );
                  let decodedToken = jwt_decode(token);
                  const tokenContext = SpinalGraphService.getContext(
                    TOKEN_LIST
                  );
                  const categoryTokenUserList = await tokenContext.getChildren(
                    'HasCategoryToken'
                  );
                  for (const categoryTokenUser of categoryTokenUserList) {
                    // @ts-ignore
                    SpinalGraphService._addNode(categoryTokenUser);
                    if (
                      categoryTokenUser.getType().get() ===
                      'MonitoringServiceUserCategory'
                    ) {
                      const TokenId = SpinalGraphService.createNode(
                        {
                          name: 'token_' + user.getName().get(),
                          type: TOKEN_TYPE,
                          token: token,
                          // @ts-ignore
                          createdToken: decodedToken.iat,
                          // @ts-ignore
                          expieredToken: decodedToken.exp,
                          userId: user.getId().get(),
                          userType: user.info.userType.get(),
                        },
                        undefined
                      );
                      const res = await SpinalGraphService.addChildInContext(
                        categoryTokenUser.getId().get(),
                        TokenId,
                        tokenContext.getId().get(),
                        MONITORING_SERVICE_TOKEN_RELATION_NAME,
                        MONITORING_SERVICE_RELATION_TYPE_PTR_LST
                      );
                      let tokenObj: IUserToken = {
                        name: res.getName().get(),
                        type: res.getType().get(),
                        token: token,
                        // @ts-ignore
                        createdToken: decodedToken.iat,
                        // @ts-ignore
                        expieredToken: decodedToken.exp,
                        userId: user.getId().get(),
                        userType: user.info.userType.get(),
                      };
                      if (tokenObj) {
                        // await this.logService.createLog(user, 'AdminLogs', 'Connection', 'Connection Valid', " Connection Valid");
                        return tokenObj;
                      }
                    }
                  }
                }
              });
          }
        }
        throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
      }
    }
  }

  public async getUsers(): Promise<IUser[]> {
    try {
      var usersObjectList = [];
      const context = SpinalGraphService.getContext(USER_LIST);
      const users = await context.getChildren('HasUser');
      for (const user of users) {
        // var platformList = [];
        // const userProfiles = await user.getChildren('HasUserProfile');
        // for (const userProfile of userProfiles) {
        //   const platformParents = await userProfile.getParents('HasUserProfile')
        //   for (const platformParent of platformParents) {
        //     if (platformParent !== undefined) {
        //       if (platformParent.getType().get() === "MonitoringServicePlatform") {
        //         platformList.push({
        //           platformId: platformParent.getId().get(),
        //           platformName: platformParent.getName().get(),
        //           idPlatformOfAdmin: platformParent.info.idPlatformOfAdmin?.get(),
        //           userProfile: {
        //             userProfileAdminId: userProfile.getId().get(),
        //             userProfileBosConfigId: userProfile.info.userProfileId.get(),
        //             userProfileName: userProfile.getName().get()
        //           }
        //         })
        //       }
        //     }
        //   }
        // }

        var userObject: IUser = {
          id: user.getId().get(),
          type: user.getType().get(),
          name: user.getName().get(),
          password: user.info.password.get(),
          email: user.info.email.get(),
          userType: user.info.userType.get(),
        };
        usersObjectList.push(userObject);
      }
      if (usersObjectList.length === 0) {
        throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
      } else {
        return usersObjectList;
      }
    } catch (error) {
      return error;
    }
  }



  public async getUser(id: string): Promise<IUser> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        const users = await context.getChildren(
          MONITORING_SERVICE_USER_RELATION_NAME
        );
        for (const user of users) {
          if (user.getId().get() === id) {
            // var platformList = [];
            // const userProfiles = await user.getChildren('HasUserProfile');
            // for (const userProfile of userProfiles) {
            //   const platformParents = await userProfile.getParents('HasUserProfile')
            //   for (const platformParent of platformParents) {
            //     if (platformParent !== undefined) {
            //       if (platformParent.getType().get() === "MonitoringServicePlatform") {
            //         platformList.push({
            //           platformId: platformParent.getId().get(),
            //           platformName: platformParent.getName().get(),
            //           idPlatformOfAdmin: platformParent.info.idPlatformOfAdmin?.get(),
            //           userProfile: {
            //             userProfileAdminId: userProfile.getId().get(),
            //             userProfileBosConfigId: userProfile.info.userProfileId.get(),
            //             userProfileName: userProfile.getName().get()
            //           }
            //         })
            //       }
            //     }
            //   }
            // }
            var userObject: IUser = {
              id: user.getId().get(),
              type: user.getType().get(),
              name: user.getName().get(),
              password: user.info.password.get(),
              email: user.info.email.get(),
              userType: user.info.userType.get(),
            };
          }
        }
      }
    }
    if (userObject) {
      return userObject;
    } else {
      throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }
  }

  public async updateUser(
    userId: string,
    requestBody: IUserUpdateParams
  ): Promise<IUser> {
    const context = await SpinalGraphService.getContext(USER_LIST);
    const users = await context.getChildren(MONITORING_SERVICE_USER_RELATION_NAME);
    var userObject: IUser;

    for (const user of users) {
      if (userId !== user.getId().get())
        if (requestBody.email === user.info.email.get()) {
          // await this.logService.createLog(user, 'UserLogs', 'Edit', 'Edit Not Valid', "modify this user with a username that already exists");
          throw new OperationError('EMAIL_IN_USE', HttpStatusCode.FORBIDDEN);
        }
    }
    for (const user of users) {
      if (user.getId().get() === userId) {
        // if (user.info.userType.get() === "Admin") {
        //   // await this.logService.createLog(user, 'UserLogs', 'Edit', 'Edit Not Valid', "modify this user with a username that is not authorized");
        //   throw new OperationError('UNAUTHORIZED ROLE', HttpStatusCode.FORBIDDEN);
        // }
        if (requestBody.email !== undefined) {
          user.info.email.set(requestBody.email);
          user.info.name.set(requestBody.email);
        }
        if (user.info.password !== undefined || user.info.password !== "") {
          bcrypt
            .hash(requestBody.password, 10)
            .then(async (hash) => {
              user.info.password.set(hash);
            })
        }
        // const oldUserProfileList = await user.getChildren('HasUserProfile');
        // const newUserPlatformList = requestBody.platformList;
        // await updateUserProfileList(oldUserProfileList, newUserPlatformList, user, this.graph);


        // var platformList = [];
        // const userProfiles = await user.getChildren('HasUserProfile');
        // for (const userProfile of userProfiles) {
        //   const platformParents = await userProfile.getParents('HasUserProfile')
        //   for (const platformParent of platformParents) {
        //     if (platformParent !== undefined) {
        //       if (platformParent.getType().get() === "MonitoringServicePlatform") {
        //         platformList.push({
        //           platformId: platformParent.getId().get(),
        //           platformName: platformParent.getName().get(),
        //           idPlatformOfAdmin: platformParent.info.idPlatformOfAdmin?.get(),
        //           userProfile: {
        //             userProfileAdminId: userProfile.getId().get(),
        //             userProfileBosConfigId: userProfile.info.userProfileId.get(),
        //             userProfileName: userProfile.getName().get()
        //           }
        //         })
        //       }
        //     }
        //   }
        // }

        userObject = {
          id: user.getId().get(),
          type: user.getType().get(),
          name: user.getName().get(),
          password: user.info.password.get(),
          email: user.info.email.get(),
          userType: user.info.userType.get(),
          // platformList: platformList,
        };

        if (userObject === undefined) {
          // await this.logService.createLog(user, 'UserLogs', 'Edit', 'Edit Not Valid', "Edit Not Valid");
          throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
        } else {
          // await this.logService.createLog(user, 'UserLogs', 'Edit', 'Edit Valid', "Edit Valid");
          return userObject;
        }
      }
    }
  }


  public async deleteUser(userId: string): Promise<void> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        const users = await context.getChildren(
          MONITORING_SERVICE_USER_RELATION_NAME
        );
        var userFound: SpinalNode<any>;
        for (const user of users) {
          if (user.getId().get() === userId) {
            userFound = user;
          }
        }
        if (userFound !== undefined) {
          // await this.logService.createLog(userFound, 'UserLogs', 'Delete', 'Delete Valid', 'Delete Valid');
          await userFound.removeFromGraph();
        } else {
          // await this.logService.createLog(userFound, 'UserLogs', 'Delete', 'Delete Not Valid', 'Delete Not Valid, User Not Found');
          throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
        }
      }
    }
  }

  async createMonitoringAdmin(): Promise<IUser> {
    let userCreationParams: IUserCreationParams = {
      password: process.env.MONITORING_ADMIN_PASSWORD,
      email: process.env.MONITORING_ADMIN_EMAIL,
      userType: IUserType.MonitoringAdmin,
      // platformList: [],
    };
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        var userCreated = await bcrypt
          .hash(userCreationParams.password, 10)
          .then(async (hash) => {
            const userObject = {
              type: USER_TYPE,
              name: userCreationParams.email,
              password: hash,
              email: userCreationParams.email,
              userType: userCreationParams.userType,
            };
            if (
              userObject.userType === 'MonitoringAdmin'
            ) {
              const UserId = SpinalGraphService.createNode(
                userObject,
                undefined
              );
              const res = await SpinalGraphService.addChildInContext(
                context.getId().get(),
                UserId,
                context.getId().get(),
                MONITORING_SERVICE_USER_RELATION_NAME,
                MONITORING_SERVICE_RELATION_TYPE_PTR_LST
              );
              return res;
            } else {
              return undefined;
            }
          });
        if (userCreated === undefined) {
          // await this.logService.createLog(undefined, 'AdminLogs', 'Create', 'Create Not Valid', "create Not Valid");
          throw new OperationError('NOT_CREATED', HttpStatusCode.BAD_REQUEST);
        } else {
          var infoObject = {
            id: userCreated.getId().get(),
            type: userCreated.getType().get(),
            name: userCreated.getName().get(),
            email: userCreated.info.email.get(),
            password: userCreated.info.password.get(),
            userType: userCreated.info.userType.get(),
          }
          // await this.logService.createLog(userCreated, 'AdminLogs', 'Create', 'Create Valid', "create Valid");
          return infoObject;
        }
      }
    }
  }

  public async updateMonitoringAdmin(
    requestBody: IUserUpdateParams
  ): Promise<IUser> {
    const context = await SpinalGraphService.getContext(USER_LIST);
    const users = await context.getChildren(MONITORING_SERVICE_USER_RELATION_NAME);
    var userObject: IUser;
    for (const user of users) {
      if (user.info.userType.get() === requestBody.userType) {
        if (requestBody.oldPassword !== undefined) {
          return bcrypt
            .compare(requestBody.oldPassword, user.info.password.get())
            .then(async (valid) => {
              if (!valid) {
                // await this.logService.createLog(user, 'AdminLogs', 'Edit', 'Edit Not Valid', "invalid old password");
                throw new OperationError(
                  'ERROR_PASSWORD',
                  HttpStatusCode.FORBIDDEN
                );
              } else {
                bcrypt.hash(requestBody.newPassword, 10).then(async (hash) => {
                  user.info.password.set(hash);
                });
                if (requestBody.email !== undefined) {
                  user.info.email.set(requestBody.email);
                }
                userObject = {
                  id: user.getId().get(),
                  type: user.getType().get(),
                  name: user.getName().get(),
                  password: user.info.password.get(),
                  email: user.info.email.get(),
                  userType: user.info.userType.get(),
                };
                if (userObject === undefined) {
                  // await this.logService.createLog(user, 'AdminLogs', 'Edit', 'Edit Not Valid', "Edit Not Valid");
                  throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
                } else {
                  // await this.logService.createLog(user, 'AdminLogs', 'Edit', 'Edit Valid', "Edit Valid");
                  return userObject;
                }
              }
            });
        }
      }
    }
    throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
  }



  public async getMonitoringAdmin(): Promise<IUser> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        const users = await context.getChildren(
          MONITORING_SERVICE_USER_RELATION_NAME
        );
        for (const user of users) {
          if (user.getName().get() === 'MonitoringAdmin') {
            var userObject: IUser = {
              id: user.getId().get(),
              type: user.getType().get(),
              name: user.getName().get(),
              password: user.info.password.get(),
              email: user.info.email.get(),
              userType: user.info.userType.get(),
            };
          }
        }
      }
    }
    if (userObject) {
      return userObject;
    } else {
      throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }
  }

  public async getInfoToken(tokenParam: string) {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === TOKEN_LIST) {
        let tokens = await context.getChildren(
          MONITORING_SERVICE_TOKEN_RELATION_NAME
        );
        for (const token of tokens) {
          if (token.info.token.get() === tokenParam) {
            return {
              name: token.info.name.get(),
              userProfileId: token.info.userProfileId.get(),
              token: token.info.token.get(),
              createdToken: token.info.createdToken.get(),
              expieredToken: token.info.expieredToken.get(),
              userId: token.info.userId.get(),
              serverId: token.info.serverId.get(),
              id: token.info.id.get(),
            };
          }
        }
      }
    }
  }
  public async userProfilesList() {
    return []
  }
  public async getRoles(): Promise<{ name: string }[]> {
    return [{ name: 'MonitoringAdmin' }, { name: 'User' }];
  }

  public async getUserLogs(id: string): Promise<IUserLogs[]> {
    var logArrayList: IUserLogs[] = [];
    var found: boolean = false;
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === USER_LIST) {
        const platforms = await context.getChildren(
          MONITORING_SERVICE_USER_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === id) {
            found = true;
            const logs = await platform.getChildren('HasLog');
            for (const log of logs) {
              var PlatformObjectLog: IUserLogs = {
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

async function updateUserProfileList(oldUserProfileList: SpinalNode<any>[], newUserPlatformList: any[], user: SpinalNode<any>, graph: SpinalGraph<any>) {
  var arrayDelete = [];
  var arrayCreate = [];

  for (const olditem of oldUserProfileList) {
    const resSome = newUserPlatformList.some(it => {
      return it.userProfile.userProfileAdminId === olditem.getId().get();
    });
    if (resSome === false) {
      arrayDelete.push(olditem);
    }
  }

  for (const newItem of newUserPlatformList) {
    const resSome = oldUserProfileList.some(it => {
      return it.getId().get() === newItem.userProfile.userProfileAdminId;
    });
    if (resSome === false) {
      arrayCreate.push(newItem);
    }
  }

  for (const arrdlt of arrayDelete) {
    await user.removeChild(arrdlt, 'HasUserProfile', MONITORING_SERVICE_RELATION_TYPE_PTR_LST)
  }

  for (const arrcrt of arrayCreate) {
    const realNode = await getrealNodeProfile(arrcrt.userProfile.userProfileAdminId, arrcrt.platformId, graph)
    await user.addChild(realNode, 'HasUserProfile', MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
  }

}

async function getrealNodeProfile(profileId: string, platformId: string, graph: SpinalGraph<any>) {
  const contexts: SpinalNode<any>[] = await graph.getChildren('hasContext');
  for (const context of contexts) {
    const platforms = await context.getChildren('HasPlatform');
    for (const platform of platforms) {
      if (platform.getId().get() === platformId) {
        const profiles = await platform.getChildren('HasUserProfile');
        for (const profile of profiles) {
          if (profile.getId().get() === profileId) {
            return profile;
          }
        }
      }
    }
  }

}

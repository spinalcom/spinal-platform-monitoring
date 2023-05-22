"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformService = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const operation_error_1 = require("../utilities/operation-error");
const http_status_code_1 = require("../utilities/http-status-code");
const spinalMiddleware_1 = require("../spinalMiddleware");
const profileServices_1 = require("./profileServices");
const jwt = require("jsonwebtoken");
/**
 *
 *
 * @export
 * @class PlatformService
 */
class PlatformService {
    // public logService: LogsService;
    constructor() {
        this.spinalMiddleware = spinalMiddleware_1.default.getInstance();
        this.spinalMiddleware.init();
        this.graph = this.spinalMiddleware.getGraph();
        // this.logService = new LogsService();
    }
    createPlateform(platformCreationParms) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.PLATFORM_LIST) {
                    const platformObject = {
                        type: constant_1.PLATFORM_TYPE,
                        name: platformCreationParms.name,
                        statusPlatform: platformCreationParms.statusPlatform,
                        TokenBosRegister: this.generateTokenBosAdmin(platformCreationParms.name),
                        infoHub: {
                            ip: platformCreationParms.infoHub.ip,
                            port: platformCreationParms.infoHub.port,
                            url: platformCreationParms.infoHub.url,
                            login: platformCreationParms.infoHub.login,
                            password: platformCreationParms.infoHub.password,
                        },
                        infoWall: {
                            ip: platformCreationParms.infoWall.ip,
                            port: platformCreationParms.infoWall.port,
                            url: platformCreationParms.infoWall.url,
                            login: platformCreationParms.infoWall.login,
                            password: platformCreationParms.infoWall.password,
                        }
                    };
                    const PlatformId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(platformObject, undefined);
                    const res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(context.getId().get(), PlatformId, context.getId().get(), constant_1.MONITORING_SERVICE_PLATFORM_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
                    // @ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(res);
                    if (res === undefined) {
                        // await this.logService.createLog(undefined, 'PlatformLogs', 'Register', 'Register Not Valid', "Register Not Valid");
                        throw new operation_error_1.OperationError('NOT_CREATED', http_status_code_1.HttpStatusCode.BAD_REQUEST);
                    }
                    else {
                        // await this.logService.createLog(res, 'PlatformLogs', 'Register', 'Register Valid', "Register Valid");
                        return {
                            id: res.getId().get(),
                            type: res.getType().get(),
                            name: res.getName().get(),
                            statusPlatform: res.info.statusPlatform.get(),
                            TokenBosRegister: res.info.TokenBosRegister,
                            infoHub: {
                                ip: res.info.infoHub.ip,
                                port: res.info.infoHub.port,
                                url: res.info.infoHub.url,
                                login: res.info.infoHub.login,
                                password: res.info.infoHub.password,
                            },
                            infoWall: {
                                ip: res.info.infoWall.ip,
                                port: res.info.infoWall.port,
                                url: res.info.infoWall.url,
                                login: res.info.infoWall.login,
                                password: res.info.infoWall.password,
                            }
                        };
                    }
                }
            }
        });
    }
    getPlateform(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.PLATFORM_LIST) {
                    const platforms = yield context.getChildren(constant_1.MONITORING_SERVICE_PLATFORM_RELATION_NAME);
                    for (const platform of platforms) {
                        if (platform.getId().get() === id) {
                            var PlatformObject = {
                                id: platform.getId().get(),
                                type: platform.getType().get(),
                                name: platform.getName().get(),
                                statusPlatform: platform.info.statusPlatform.get(),
                                TokenBosRegister: platform.info.TokenBosRegister,
                                infoHub: {
                                    ip: platform.info.infoHub.ip,
                                    port: platform.info.infoHub.port,
                                    url: platform.info.infoHub.url,
                                    login: platform.info.infoHub.login,
                                    password: platform.info.infoHub.password,
                                },
                                infoWall: {
                                    ip: platform.info.infoWall.ip,
                                    port: platform.info.infoWall.port,
                                    url: platform.info.infoWall.url,
                                    login: platform.info.infoWall.login,
                                    password: platform.info.infoWall.password,
                                }
                            };
                        }
                    }
                }
            }
            if (PlatformObject) {
                return PlatformObject;
            }
            else {
                throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
            }
        });
    }
    getPlateforms() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var platformObjectList = [];
                const contexts = yield this.graph.getChildren('hasContext');
                for (const context of contexts) {
                    if (context.getName().get() === constant_1.PLATFORM_LIST) {
                        const platforms = yield context.getChildren(constant_1.MONITORING_SERVICE_PLATFORM_RELATION_NAME);
                        for (const platform of platforms) {
                            var PlatformObject = {
                                id: platform.getId().get(),
                                type: platform.getType().get(),
                                name: platform.getName().get(),
                                statusPlatform: platform.info.statusPlatform.get(),
                                TokenBosRegister: platform.info.TokenBosRegister,
                                infoHub: {
                                    ip: platform.info.infoHub.ip,
                                    port: platform.info.infoHub.port,
                                    url: platform.info.infoHub.url,
                                    login: platform.info.infoHub.login,
                                    password: platform.info.infoHub.password,
                                },
                                infoWall: {
                                    ip: platform.info.infoWall.ip,
                                    port: platform.info.infoWall.port,
                                    url: platform.info.infoWall.url,
                                    login: platform.info.infoWall.login,
                                    password: platform.info.infoWall.password,
                                }
                            };
                            platformObjectList.push(PlatformObject);
                        }
                    }
                }
                return platformObjectList;
            }
            catch (error) {
                return error;
            }
        });
    }
    updatePlateform(id, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.PLATFORM_LIST) {
                    const platforms = yield context.getChildren(constant_1.MONITORING_SERVICE_PLATFORM_RELATION_NAME);
                    for (const platform of platforms) {
                        if (platform.getId().get() === id) {
                            if (requestBody.name !== undefined) {
                                platform.info.name.set(requestBody.name);
                            }
                            if (requestBody.statusPlatform !== undefined) {
                                platform.info.statusPlatform.set(requestBody.statusPlatform);
                            }
                            if (requestBody.infoHub.ip !== undefined) {
                                platform.info.infoHub.ip.set(requestBody.infoHub.ip);
                            }
                            if (requestBody.infoHub.port !== undefined) {
                                platform.info.infoHub.port.set(requestBody.infoHub.port);
                            }
                            if (requestBody.infoHub.url !== undefined) {
                                platform.info.infoHub.url.set(requestBody.infoHub.url);
                            }
                            if (requestBody.infoHub.login !== undefined) {
                                platform.info.infoHub.login.set(requestBody.infoHub.login);
                            }
                            if (requestBody.infoHub.password !== undefined) {
                                platform.info.infoHub.password.set(requestBody.infoHub.password);
                            }
                            if (requestBody.infoWall.ip !== undefined) {
                                platform.info.infoWall.ip.set(requestBody.infoWall.ip);
                            }
                            if (requestBody.infoWall.port !== undefined) {
                                platform.info.infoWall.port.set(requestBody.infoWall.port);
                            }
                            if (requestBody.infoWall.url !== undefined) {
                                platform.info.infoWall.url.set(requestBody.infoWall.url);
                            }
                            if (requestBody.infoWall.login !== undefined) {
                                platform.info.infoWall.login.set(requestBody.infoWall.login);
                            }
                            if (requestBody.infoWall.password !== undefined) {
                                platform.info.infoWall.password.set(requestBody.infoWall.password);
                            }
                            // await this.logService.createLog(platform, 'PlatformLogs', 'Edit', 'Edit Valid', "Edit Valid");
                            return {
                                id: platform.getId().get(),
                                type: platform.getType().get(),
                                name: platform.getName().get(),
                                statusPlatform: platform.info.statusPlatform.get(),
                                TokenBosRegister: platform.info.TokenBosRegister,
                                infoHub: {
                                    ip: platform.info.infoHub.ip,
                                    port: platform.info.infoHub.port,
                                    url: platform.info.infoHub.url,
                                    login: platform.info.infoHub.login,
                                    password: platform.info.infoHub.password,
                                },
                                infoWall: {
                                    ip: platform.info.infoWall.ip,
                                    port: platform.info.infoWall.port,
                                    url: platform.info.infoWall.url,
                                    login: platform.info.infoWall.login,
                                    password: platform.info.infoWall.password,
                                }
                            };
                        }
                    }
                }
            }
        });
    }
    deletePlatform(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.PLATFORM_LIST) {
                    const platforms = yield context.getChildren(constant_1.MONITORING_SERVICE_PLATFORM_RELATION_NAME);
                    var platformFound;
                    for (const platform of platforms) {
                        if (platform.getId().get() === id) {
                            platformFound = platform;
                        }
                    }
                    if (platformFound !== undefined) {
                        // await this.logService.createLog(platformFound, 'PlatformLogs', 'Delete', 'Delete Valid', "Delete Valid");
                        yield platformFound.removeFromGraph();
                    }
                    else {
                        // await this.logService.createLog(undefined, 'PlatformLogs', 'Delete', 'Delete Not Valid', "Delete Not Valid");
                        throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
                    }
                }
            }
        });
    }
    // public async createAuthPlateform(): Promise<IPlatform> {
    //   const contexts = await this.graph.getChildren('hasContext');
    //   for (const context of contexts) {
    //     if (context.getName().get() === PLATFORM_LIST) {
    //       // @ts-ignore
    //       SpinalGraphService._addNode(context);
    //       const platformObject: IPlateformCreationParams = {
    //         name: 'authenticationPlatform',
    //         type: PLATFORM_TYPE,
    //         statusPlatform: statusPlatform.online,
    //         url: process.env.SPINALHUB_URL,
    //         TokenBosAdmin: this.generateTokenBosAdmin('authenticationPlatform'),
    //         address: '',
    //         TokenAdminBos: '',
    //         idPlatformOfAdmin: '',
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
    //           url: res.info.url?.get(),
    //         };
    //       }
    //     }
    //   }
    // }
    createRegisterKeyNode() {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === 'infoAdmin') {
                    // @ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(context);
                    const registerKeyObject = {
                        name: 'registerKey',
                        type: constant_1.REGISTER_KEY_TYPE,
                        value: this.generateRegisterKey(),
                    };
                    const regesterKeyId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(registerKeyObject, undefined);
                    const res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(context.getId().get(), regesterKeyId, context.getId().get(), constant_1.MONITORING_SERVICE_INFO_ADMIN_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
                    return {
                        id: res.getId().get(),
                        type: res.getType().get(),
                        name: res.getName().get(),
                        value: res.info.value.get(),
                    };
                }
            }
        });
    }
    generateRegisterKey() {
        const generator = require('generate-password');
        var registerKey = generator.generate({
            length: 20,
            numbers: true,
        });
        return registerKey;
    }
    updateRegisterKeyNode() {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.INFO_ADMIN) {
                    // @ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(context);
                    const childrens = yield context.getChildren(constant_1.MONITORING_SERVICE_INFO_ADMIN_RELATION_NAME);
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
        });
    }
    getRegisterKeyNode() {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.INFO_ADMIN) {
                    // @ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(context);
                    const childrens = yield context.getChildren(constant_1.MONITORING_SERVICE_INFO_ADMIN_RELATION_NAME);
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
        });
    }
    generateTokenBosAdmin(platformName) {
        const dotenv = require('dotenv');
        dotenv.config();
        let token = jwt.sign({ platformName: platformName }, process.env.TOKEN_SECRET, {
            expiresIn: '24h',
        });
        // let decodedToken = jwt_decode(token);
        return token;
    }
    registerNewPlatform(object) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            var registerKey;
            for (const context of contexts) {
                if (context.getName().get() === constant_1.INFO_ADMIN) {
                    const childrens = yield context.getChildren(constant_1.MONITORING_SERVICE_INFO_ADMIN_RELATION_NAME);
                    registerKey = childrens[0].info.value.get();
                }
            }
            if (object.registerKey === registerKey) {
                const res = yield this.createPlateform(object.platformCreationParms);
                return res;
            }
            else {
                // await this.logService.createLog(undefined, 'PlatformLogs', 'Register', 'Register Not Valid', "registerKey Not Valid");
                throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
            }
        });
    }
    updateNewPlatform(updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.PLATFORM_LIST) {
                    const platformList = yield context.getChildren('HasPlatform');
                    for (const platform of platformList) {
                        // @ts-ignore
                        spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(platform);
                        if (platform.getId().get() === updateParams.platformId) {
                            if (platform.info.TokenBosAdmin.get() === updateParams.TokenBosAdmin) {
                                if (updateParams.jsonData) {
                                    //update the old Organ List
                                    const oldOrgans = yield platform.getChildren('HasOrgan');
                                    yield updateOrganProfile(oldOrgans, platform, updateParams.jsonData.organList);
                                    // update th old user Profiles
                                    const oldUserProfileList = yield platform.getChildren('HasUserProfile');
                                    yield updateAppUserProfile(oldUserProfileList, platform, updateParams.jsonData.userProfileList, "userProfile");
                                    // update the old app profiles
                                    const oldAppProfileList = yield platform.getChildren('HasAppProfile');
                                    yield updateAppUserProfile(oldAppProfileList, platform, updateParams.jsonData.appProfileList, "appProfile");
                                    platform.info.idPlatformOfAdmin.set(updateParams.idPlatformOfAdmin);
                                    platform.info.TokenAdminBos.set(updateParams.TokenAdminBos);
                                    // await this.logService.createLog(platform, 'PlatformLogs', 'PushData', 'Push Data', "Push Data Valid ");
                                }
                            }
                            else {
                                // await this.logService.createLog(platform, 'PlatformLogs', 'PushData', 'Push Data Not Valid', "Push Data Not Valid Empty Json Data");
                                throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
                            }
                        }
                    }
                }
            }
        });
    }
    getPlateformLogs(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var logArrayList = [];
            var found = false;
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.PLATFORM_LIST) {
                    const platforms = yield context.getChildren(constant_1.MONITORING_SERVICE_PLATFORM_RELATION_NAME);
                    for (const platform of platforms) {
                        if (platform.getId().get() === id) {
                            found = true;
                            const logs = yield platform.getChildren('HasLog');
                            for (const log of logs) {
                                var PlatformObjectLog = {
                                    id: log.getId().get(),
                                    type: log.getType().get(),
                                    name: log.getName().get(),
                                    date: log.info.date.get(),
                                    message: log.info.message.get(),
                                    actor: {
                                        actorId: log.info.actor.actorId.get(),
                                        actorName: log.info.actor.actorName.get()
                                    }
                                };
                                logArrayList.push(PlatformObjectLog);
                            }
                        }
                    }
                }
            }
            if (found === true) {
                return logArrayList;
            }
            else {
                throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
            }
        });
    }
}
exports.PlatformService = PlatformService;
function updateOrganProfile(oldOrgans, platform, newList) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield organ.removeFromGraph();
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
    });
}
function updateAppUserProfile(oldList, platform, newList, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileServices = new profileServices_1.ProfileServices();
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
                yield item.removeFromGraph();
            }
            for (const item of arrayCreate) {
                profileServices.createUserProfileService({
                    userProfileId: item.userProfileId,
                    name: item.label,
                    platformId: platform.getId().get(),
                });
            }
        }
        else if (type === "appProfile") {
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
                yield item.removeFromGraph();
            }
            for (const item of arrayCreate) {
                profileServices.createAppProfileService({
                    appProfileId: item.appProfileId,
                    name: item.label,
                    platformId: platform.getId().get(),
                });
            }
        }
    });
}
//# sourceMappingURL=platformServices.js.map
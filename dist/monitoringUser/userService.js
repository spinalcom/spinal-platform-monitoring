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
exports.UserService = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const operation_error_1 = require("../utilities/operation-error");
const http_status_code_1 = require("../utilities/http-status-code");
const user_model_1 = require("./user.model");
const spinalMiddleware_1 = require("../spinalMiddleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_decode_1 = require("jwt-decode");
/**
 * @export
 * @class UserService
 */
class UserService {
    // public logService: LogsService;
    constructor() {
        this.spinalMiddleware = spinalMiddleware_1.default.getInstance();
        this.spinalMiddleware.init();
        this.graph = this.spinalMiddleware.getGraph();
        // this.logService = new LogsService();
    }
    createUser(userCreationParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    const users = yield context.getChildren('HasUser');
                    for (const user of users) {
                        if (user.info.email.get() === userCreationParams.email) {
                            // await this.logService.createLog(user, 'UserLogs', 'Create', 'Create Not Valid', "create a new user with this userName");
                            throw new operation_error_1.OperationError('EMAIL_IN_USE', http_status_code_1.HttpStatusCode.FORBIDDEN);
                        }
                    }
                    console.log("service", userCreationParams);
                    var userNode = bcrypt
                        .hash(userCreationParams.password, 10)
                        .then((hash) => __awaiter(this, void 0, void 0, function* () {
                        const userObject = {
                            type: constant_1.USER_TYPE,
                            name: userCreationParams.email,
                            email: userCreationParams.email,
                            userType: userCreationParams.userType,
                            password: hash,
                        };
                        if (userObject.userType !== 'MonitoringAdmin') {
                            const UserId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(userObject, undefined);
                            const res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(context.getId().get(), UserId, context.getId().get(), constant_1.MONITORING_SERVICE_USER_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
                            return res;
                        }
                        else {
                            return undefined;
                        }
                    }));
                    const userCreated = userNode;
                    if (userCreated === undefined) {
                        // await this.logService.createLog(userCreated, 'UserLogs', 'Create', 'Create Not Valid', "Create Not Valid");
                        throw new operation_error_1.OperationError('NOT_CREATED', http_status_code_1.HttpStatusCode.BAD_REQUEST);
                    }
                    else {
                        // await this.logService.createLog(userCreated, 'UserLogs', 'Create', 'Create Valid', "Create Valid");
                        return {
                            id: userCreated.getId().get(),
                            type: userCreated.getType().get(),
                            name: userCreated.getName().get(),
                            email: userCreated.info.email.get(),
                            password: userCreated.info.password.get(),
                            userType: userCreated.info.userType.get(),
                        };
                        ;
                    }
                }
            }
        });
    }
    login(userLoginParams) {
        return __awaiter(this, void 0, void 0, function* () {
            // const logService = new LogsService();
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    const users = yield context.getChildren(constant_1.MONITORING_SERVICE_USER_RELATION_NAME);
                    for (const user of users) {
                        if (userLoginParams.email === user.info.email.get()) {
                            return bcrypt
                                .compare(userLoginParams.password, user.info.password.get())
                                .then((valid) => __awaiter(this, void 0, void 0, function* () {
                                if (!valid) {
                                    // await this.logService.createLog(user, 'UserLogs', 'Connection', 'User Valid Unknown Password', "User Valid Unknown Password");
                                    throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
                                }
                                else {
                                    let token = jwt.sign({ userId: user.getId().get() }, 'RANDOM_TOKEN_SECRET', { expiresIn: '1h' });
                                    let decodedToken = (0, jwt_decode_1.default)(token);
                                    const tokenContext = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(constant_1.TOKEN_LIST);
                                    const categoryTokenUserList = yield tokenContext.getChildren('HasCategoryToken');
                                    for (const categoryTokenUser of categoryTokenUserList) {
                                        // @ts-ignore
                                        spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(categoryTokenUser);
                                        if (categoryTokenUser.getType().get() ===
                                            'MonitoringServiceUserCategory') {
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
                                            const TokenId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                                                name: 'token_' + user.getName().get(),
                                                type: constant_1.TOKEN_TYPE,
                                                token: token,
                                                // @ts-ignore
                                                createdToken: decodedToken.iat,
                                                // @ts-ignore
                                                expieredToken: decodedToken.exp,
                                                userId: user.getId().get(),
                                            }, undefined);
                                            const res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(categoryTokenUser.getId().get(), TokenId, tokenContext.getId().get(), constant_1.MONITORING_SERVICE_TOKEN_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
                                            let tokenObj = {
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
                            }));
                        }
                    }
                    // await this.logService.createLog(undefined, 'UserLogs', 'Connection', 'User Not Valid', "User Not Valid");
                    throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
                }
            }
        });
    }
    loginMonitoringAdmin(userLoginParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    const users = yield context.getChildren(constant_1.MONITORING_SERVICE_USER_RELATION_NAME);
                    for (const user of users) {
                        if (userLoginParams.email === user.info.email.get() && user.info.userType.get() === "MonitoringAdmin") {
                            return bcrypt
                                .compare(userLoginParams.password, user.info.password.get())
                                .then((valid) => __awaiter(this, void 0, void 0, function* () {
                                if (!valid) {
                                    // await this.logService.createLog(user, 'AdminLogs', 'Connection', 'Connection Not Valid', " Unknown AuthAdmin Password");
                                    throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
                                }
                                else {
                                    let token = jwt.sign({ userId: user.getId().get() }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
                                    let decodedToken = (0, jwt_decode_1.default)(token);
                                    const tokenContext = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(constant_1.TOKEN_LIST);
                                    const categoryTokenUserList = yield tokenContext.getChildren('HasCategoryToken');
                                    for (const categoryTokenUser of categoryTokenUserList) {
                                        // @ts-ignore
                                        spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(categoryTokenUser);
                                        if (categoryTokenUser.getType().get() ===
                                            'MonitoringServiceUserCategory') {
                                            const TokenId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                                                name: 'token_' + user.getName().get(),
                                                type: constant_1.TOKEN_TYPE,
                                                token: token,
                                                // @ts-ignore
                                                createdToken: decodedToken.iat,
                                                // @ts-ignore
                                                expieredToken: decodedToken.exp,
                                                userId: user.getId().get(),
                                                userType: user.info.userType.get(),
                                            }, undefined);
                                            const res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(categoryTokenUser.getId().get(), TokenId, tokenContext.getId().get(), constant_1.MONITORING_SERVICE_TOKEN_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
                                            let tokenObj = {
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
                            }));
                        }
                    }
                    throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
                }
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var usersObjectList = [];
                const context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(constant_1.USER_LIST);
                const users = yield context.getChildren('HasUser');
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
                    var userObject = {
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
                    throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
                }
                else {
                    return usersObjectList;
                }
            }
            catch (error) {
                return error;
            }
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    const users = yield context.getChildren(constant_1.MONITORING_SERVICE_USER_RELATION_NAME);
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
                            var userObject = {
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
            }
            else {
                throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
            }
        });
    }
    updateUser(userId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(constant_1.USER_LIST);
            const users = yield context.getChildren(constant_1.MONITORING_SERVICE_USER_RELATION_NAME);
            var userObject;
            for (const user of users) {
                if (userId !== user.getId().get())
                    if (requestBody.email === user.info.email.get()) {
                        // await this.logService.createLog(user, 'UserLogs', 'Edit', 'Edit Not Valid', "modify this user with a username that already exists");
                        throw new operation_error_1.OperationError('EMAIL_IN_USE', http_status_code_1.HttpStatusCode.FORBIDDEN);
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
                            .then((hash) => __awaiter(this, void 0, void 0, function* () {
                            user.info.password.set(hash);
                        }));
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
                        throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
                    }
                    else {
                        // await this.logService.createLog(user, 'UserLogs', 'Edit', 'Edit Valid', "Edit Valid");
                        return userObject;
                    }
                }
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    const users = yield context.getChildren(constant_1.MONITORING_SERVICE_USER_RELATION_NAME);
                    var userFound;
                    for (const user of users) {
                        if (user.getId().get() === userId) {
                            userFound = user;
                        }
                    }
                    if (userFound !== undefined) {
                        // await this.logService.createLog(userFound, 'UserLogs', 'Delete', 'Delete Valid', 'Delete Valid');
                        yield userFound.removeFromGraph();
                    }
                    else {
                        // await this.logService.createLog(userFound, 'UserLogs', 'Delete', 'Delete Not Valid', 'Delete Not Valid, User Not Found');
                        throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
                    }
                }
            }
        });
    }
    createMonitoringAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            let userCreationParams = {
                password: process.env.MONITORING_ADMIN_PASSWORD,
                email: process.env.MONITORING_ADMIN_EMAIL,
                userType: user_model_1.IUserType.MonitoringAdmin,
                // platformList: [],
            };
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    var userCreated = yield bcrypt
                        .hash(userCreationParams.password, 10)
                        .then((hash) => __awaiter(this, void 0, void 0, function* () {
                        const userObject = {
                            type: constant_1.USER_TYPE,
                            name: userCreationParams.email,
                            password: hash,
                            email: userCreationParams.email,
                            userType: userCreationParams.userType,
                        };
                        if (userObject.userType === 'MonitoringAdmin') {
                            const UserId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(userObject, undefined);
                            const res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(context.getId().get(), UserId, context.getId().get(), constant_1.MONITORING_SERVICE_USER_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
                            return res;
                        }
                        else {
                            return undefined;
                        }
                    }));
                    if (userCreated === undefined) {
                        // await this.logService.createLog(undefined, 'AdminLogs', 'Create', 'Create Not Valid', "create Not Valid");
                        throw new operation_error_1.OperationError('NOT_CREATED', http_status_code_1.HttpStatusCode.BAD_REQUEST);
                    }
                    else {
                        var infoObject = {
                            id: userCreated.getId().get(),
                            type: userCreated.getType().get(),
                            name: userCreated.getName().get(),
                            email: userCreated.info.email.get(),
                            password: userCreated.info.password.get(),
                            userType: userCreated.info.userType.get(),
                        };
                        // await this.logService.createLog(userCreated, 'AdminLogs', 'Create', 'Create Valid', "create Valid");
                        return infoObject;
                    }
                }
            }
        });
    }
    updateMonitoringAdmin(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(constant_1.USER_LIST);
            const users = yield context.getChildren(constant_1.MONITORING_SERVICE_USER_RELATION_NAME);
            var userObject;
            for (const user of users) {
                if (user.info.userType.get() === requestBody.userType) {
                    if (requestBody.oldPassword !== undefined) {
                        return bcrypt
                            .compare(requestBody.oldPassword, user.info.password.get())
                            .then((valid) => __awaiter(this, void 0, void 0, function* () {
                            if (!valid) {
                                // await this.logService.createLog(user, 'AdminLogs', 'Edit', 'Edit Not Valid', "invalid old password");
                                throw new operation_error_1.OperationError('ERROR_PASSWORD', http_status_code_1.HttpStatusCode.FORBIDDEN);
                            }
                            else {
                                bcrypt.hash(requestBody.newPassword, 10).then((hash) => __awaiter(this, void 0, void 0, function* () {
                                    user.info.password.set(hash);
                                }));
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
                                    throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
                                }
                                else {
                                    // await this.logService.createLog(user, 'AdminLogs', 'Edit', 'Edit Valid', "Edit Valid");
                                    return userObject;
                                }
                            }
                        }));
                    }
                }
            }
            throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
        });
    }
    getMonitoringAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    const users = yield context.getChildren(constant_1.MONITORING_SERVICE_USER_RELATION_NAME);
                    for (const user of users) {
                        if (user.getName().get() === 'MonitoringAdmin') {
                            var userObject = {
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
            }
            else {
                throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
            }
        });
    }
    getInfoToken(tokenParam) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.TOKEN_LIST) {
                    let tokens = yield context.getChildren(constant_1.MONITORING_SERVICE_TOKEN_RELATION_NAME);
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
        });
    }
    userProfilesList() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    getRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return [{ name: 'MonitoringAdmin' }, { name: 'User' }];
        });
    }
    getUserLogs(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var logArrayList = [];
            var found = false;
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    const platforms = yield context.getChildren(constant_1.MONITORING_SERVICE_USER_RELATION_NAME);
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
exports.UserService = UserService;
function updateUserProfileList(oldUserProfileList, newUserPlatformList, user, graph) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield user.removeChild(arrdlt, 'HasUserProfile', constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
        }
        for (const arrcrt of arrayCreate) {
            const realNode = yield getrealNodeProfile(arrcrt.userProfile.userProfileAdminId, arrcrt.platformId, graph);
            yield user.addChild(realNode, 'HasUserProfile', constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
        }
    });
}
function getrealNodeProfile(profileId, platformId, graph) {
    return __awaiter(this, void 0, void 0, function* () {
        const contexts = yield graph.getChildren('hasContext');
        for (const context of contexts) {
            const platforms = yield context.getChildren('HasPlatform');
            for (const platform of platforms) {
                if (platform.getId().get() === platformId) {
                    const profiles = yield platform.getChildren('HasUserProfile');
                    for (const profile of profiles) {
                        if (profile.getId().get() === profileId) {
                            return profile;
                        }
                    }
                }
            }
        }
    });
}
//# sourceMappingURL=userService.js.map
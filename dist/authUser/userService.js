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
    getProfile(platformId, profileIdBosConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === 'platformList') {
                    const platforms = yield context.getChildren('HasPlatform');
                    for (const platform of platforms) {
                        if (platform.getId().get() === platformId) {
                            const userProfiles = yield platform.getChildren('HasUserProfile');
                            for (const profile of userProfiles) {
                                if (profile.info.userProfileId.get() === profileIdBosConfig) {
                                    return profile;
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    createUser(userCreationParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    const users = yield context.getChildren('HasUser');
                    for (const user of users) {
                        if (user.info.userName.get() === userCreationParams.userName) {
                            // await this.logService.createLog(user, 'UserLogs', 'Create', 'Create Not Valid', "create a new user with this userName");
                            throw new operation_error_1.OperationError('USERNAME_IS_ALREADY_USED', http_status_code_1.HttpStatusCode.FORBIDDEN);
                        }
                    }
                    var userNode = bcrypt
                        .hash(userCreationParams.password, 10)
                        .then((hash) => __awaiter(this, void 0, void 0, function* () {
                        const userObject = {
                            type: constant_1.USER_TYPE,
                            name: userCreationParams.userName,
                            userType: userCreationParams.userType,
                            userName: userCreationParams.userName,
                            email: userCreationParams.email,
                            telephone: userCreationParams.telephone,
                            info: userCreationParams.info,
                            password: hash,
                        };
                        if (userObject.userType !== 'authAdmin' &&
                            userObject.userName !== 'authAdmin') {
                            const UserId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(userObject, undefined);
                            const res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(context.getId().get(), UserId, context.getId().get(), constant_1.AUTH_SERVICE_USER_RELATION_NAME, constant_1.AUTH_SERVICE_RELATION_TYPE_PTR_LST);
                            for (const platform of userCreationParams.platformList) {
                                const pro = yield this.getProfile(platform.platformId, platform.userProfile.userProfileId);
                                // @ts-ignore
                                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(pro);
                                yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(res.getId().get(), pro.getId().get(), 'HasUserProfile', constant_1.AUTH_SERVICE_RELATION_TYPE_PTR_LST);
                            }
                            return res;
                        }
                        else {
                            return undefined;
                        }
                    }));
                    const userCreated = yield userNode;
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
                            userName: userCreated.info.userName.get(),
                            password: userCreated.info.password.get(),
                            email: userCreated.info.email.get(),
                            telephone: userCreated.info.telephone.get(),
                            info: userCreated.info.info.get(),
                            userType: userCreated.info.userType.get(),
                            // platformList: res.info.platformList.get(),
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
                    const users = yield context.getChildren(constant_1.AUTH_SERVICE_USER_RELATION_NAME);
                    for (const user of users) {
                        if (userLoginParams.userName === user.info.userName.get()) {
                            return bcrypt
                                .compare(userLoginParams.password, user.info.password.get())
                                .then((valid) => __awaiter(this, void 0, void 0, function* () {
                                var _a;
                                if (!valid) {
                                    // await this.logService.createLog(user, 'UserLogs', 'Connection', 'User Valid Unknown Password', "User Valid Unknown Password");
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
                                            'AuthServiceUserCategory') {
                                            var platformList = [];
                                            const userProfiles = yield user.getChildren('HasUserProfile');
                                            for (const userProfile of userProfiles) {
                                                const platformParents = yield userProfile.getParents('HasUserProfile');
                                                for (const platformParent of platformParents) {
                                                    if (platformParent !== undefined) {
                                                        if (platformParent.getType().get() === "AuthServicePlatform") {
                                                            platformList.push({
                                                                platformId: platformParent.getId().get(),
                                                                platformName: platformParent.getName().get(),
                                                                idPlatformOfAdmin: (_a = platformParent.info.idPlatformOfAdmin) === null || _a === void 0 ? void 0 : _a.get(),
                                                                userProfile: {
                                                                    userProfileAdminId: userProfile.getId().get(),
                                                                    userProfileBosConfigId: userProfile.info.userProfileId.get(),
                                                                    userProfileName: userProfile.getName().get()
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                            const TokenId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
                                                name: 'token_' + user.getName().get(),
                                                type: constant_1.TOKEN_TYPE,
                                                token: token,
                                                // @ts-ignore
                                                createdToken: decodedToken.iat,
                                                // @ts-ignore
                                                expieredToken: decodedToken.exp,
                                                userId: user.getId().get(),
                                                platformList: platformList,
                                            }, undefined);
                                            const res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(categoryTokenUser.getId().get(), TokenId, tokenContext.getId().get(), constant_1.AUTH_SERVICE_TOKEN_RELATION_NAME, constant_1.AUTH_SERVICE_RELATION_TYPE_PTR_LST);
                                            let tokenObj = {
                                                name: res.getName().get(),
                                                token: token,
                                                // @ts-ignore
                                                createdToken: decodedToken.iat,
                                                // @ts-ignore
                                                expieredToken: decodedToken.exp,
                                                userId: user.getId().get(),
                                                platformList: platformList,
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
    loginAuthAdmin(userLoginParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    const users = yield context.getChildren(constant_1.AUTH_SERVICE_USER_RELATION_NAME);
                    for (const user of users) {
                        if (userLoginParams.userName === 'authAdmin') {
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
                                            'AuthServiceUserCategory') {
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
                                                // platformList: user.info.platformList.get(),
                                            }, undefined);
                                            const res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(categoryTokenUser.getId().get(), TokenId, tokenContext.getId().get(), constant_1.AUTH_SERVICE_TOKEN_RELATION_NAME, constant_1.AUTH_SERVICE_RELATION_TYPE_PTR_LST);
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var usersObjectList = [];
                const context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(constant_1.USER_LIST);
                const users = yield context.getChildren('HasUser');
                for (const user of users) {
                    var platformList = [];
                    const userProfiles = yield user.getChildren('HasUserProfile');
                    for (const userProfile of userProfiles) {
                        const platformParents = yield userProfile.getParents('HasUserProfile');
                        for (const platformParent of platformParents) {
                            if (platformParent !== undefined) {
                                if (platformParent.getType().get() === "AuthServicePlatform") {
                                    platformList.push({
                                        platformId: platformParent.getId().get(),
                                        platformName: platformParent.getName().get(),
                                        idPlatformOfAdmin: (_a = platformParent.info.idPlatformOfAdmin) === null || _a === void 0 ? void 0 : _a.get(),
                                        userProfile: {
                                            userProfileAdminId: userProfile.getId().get(),
                                            userProfileBosConfigId: userProfile.info.userProfileId.get(),
                                            userProfileName: userProfile.getName().get()
                                        }
                                    });
                                }
                            }
                        }
                    }
                    var userObject = {
                        id: user.getId().get(),
                        type: user.getType().get(),
                        name: user.getName().get(),
                        userName: user.info.userName.get(),
                        password: user.info.password.get(),
                        email: user.info.email.get(),
                        telephone: user.info.telephone.get(),
                        info: user.info.info.get(),
                        userType: user.info.userType.get(),
                        platformList: platformList,
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    const users = yield context.getChildren(constant_1.AUTH_SERVICE_USER_RELATION_NAME);
                    for (const user of users) {
                        if (user.getId().get() === id) {
                            var platformList = [];
                            const userProfiles = yield user.getChildren('HasUserProfile');
                            for (const userProfile of userProfiles) {
                                const platformParents = yield userProfile.getParents('HasUserProfile');
                                for (const platformParent of platformParents) {
                                    if (platformParent !== undefined) {
                                        if (platformParent.getType().get() === "AuthServicePlatform") {
                                            platformList.push({
                                                platformId: platformParent.getId().get(),
                                                platformName: platformParent.getName().get(),
                                                idPlatformOfAdmin: (_a = platformParent.info.idPlatformOfAdmin) === null || _a === void 0 ? void 0 : _a.get(),
                                                userProfile: {
                                                    userProfileAdminId: userProfile.getId().get(),
                                                    userProfileBosConfigId: userProfile.info.userProfileId.get(),
                                                    userProfileName: userProfile.getName().get()
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                            var userObject = {
                                id: user.getId().get(),
                                type: user.getType().get(),
                                name: user.getName().get(),
                                userName: user.info.userName.get(),
                                password: user.info.password.get(),
                                email: user.info.email.get(),
                                telephone: user.info.telephone.get(),
                                info: user.info.info.get(),
                                userType: user.info.userType.get(),
                                platformList: platformList,
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(constant_1.USER_LIST);
            const users = yield context.getChildren(constant_1.AUTH_SERVICE_USER_RELATION_NAME);
            var userObject;
            for (const user of users) {
                if (userId !== user.getId().get())
                    if (requestBody.userName === user.info.userName.get()) {
                        // await this.logService.createLog(user, 'UserLogs', 'Edit', 'Edit Not Valid', "modify this user with a username that already exists");
                        throw new operation_error_1.OperationError('USERNAME_IS_ALREADY_USED', http_status_code_1.HttpStatusCode.FORBIDDEN);
                    }
            }
            for (const user of users) {
                if (user.getId().get() === userId) {
                    if (requestBody.userName === "authAdmin") {
                        // await this.logService.createLog(user, 'UserLogs', 'Edit', 'Edit Not Valid', "modify this user with a username that is not authorized");
                        throw new operation_error_1.OperationError('UNAUTHORIZED ROLE', http_status_code_1.HttpStatusCode.FORBIDDEN);
                    }
                    if (requestBody.userName !== undefined) {
                        user.info.userName.set(requestBody.userName);
                        user.info.name.set(requestBody.userName);
                    }
                    if (user.info.password !== undefined || user.info.password !== "") {
                        bcrypt
                            .hash(requestBody.password, 10)
                            .then((hash) => __awaiter(this, void 0, void 0, function* () {
                            user.info.password.set(hash);
                        }));
                    }
                    if (requestBody.userType !== undefined &&
                        user.info.userType !== 'authAdmin') {
                        user.info.userType.set(requestBody.userType);
                    }
                    const oldUserProfileList = yield user.getChildren('HasUserProfile');
                    const newUserPlatformList = requestBody.platformList;
                    yield updateUserProfileList(oldUserProfileList, newUserPlatformList, user, this.graph);
                    var platformList = [];
                    const userProfiles = yield user.getChildren('HasUserProfile');
                    for (const userProfile of userProfiles) {
                        const platformParents = yield userProfile.getParents('HasUserProfile');
                        for (const platformParent of platformParents) {
                            if (platformParent !== undefined) {
                                if (platformParent.getType().get() === "AuthServicePlatform") {
                                    platformList.push({
                                        platformId: platformParent.getId().get(),
                                        platformName: platformParent.getName().get(),
                                        idPlatformOfAdmin: (_a = platformParent.info.idPlatformOfAdmin) === null || _a === void 0 ? void 0 : _a.get(),
                                        userProfile: {
                                            userProfileAdminId: userProfile.getId().get(),
                                            userProfileBosConfigId: userProfile.info.userProfileId.get(),
                                            userProfileName: userProfile.getName().get()
                                        }
                                    });
                                }
                            }
                        }
                    }
                    userObject = {
                        id: user.getId().get(),
                        type: user.getType().get(),
                        name: user.getName().get(),
                        userName: user.info.userName.get(),
                        password: user.info.password.get(),
                        email: user.info.email.get(),
                        telephone: user.info.telephone.get(),
                        info: user.info.info.get(),
                        userType: user.info.userType.get(),
                        platformList: platformList,
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
                    const users = yield context.getChildren(constant_1.AUTH_SERVICE_USER_RELATION_NAME);
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
    createAuthAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            let userCreationParams = {
                userName: 'authAdmin',
                password: process.env.AUTH_ADMIN_PASSWORD,
                email: '',
                telephone: '',
                info: '',
                userType: user_model_1.IUserType.authAdmin,
                platformList: [],
            };
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    var userCreated = yield bcrypt
                        .hash(userCreationParams.password, 10)
                        .then((hash) => __awaiter(this, void 0, void 0, function* () {
                        const userObject = {
                            type: constant_1.USER_TYPE,
                            name: userCreationParams.userName,
                            userName: userCreationParams.userName,
                            password: hash,
                            email: userCreationParams.email,
                            telephone: userCreationParams.telephone,
                            info: '',
                            userType: userCreationParams.userType,
                        };
                        if (userObject.userType === 'authAdmin' &&
                            userObject.userName === 'authAdmin') {
                            const UserId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(userObject, undefined);
                            const res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(context.getId().get(), UserId, context.getId().get(), constant_1.AUTH_SERVICE_USER_RELATION_NAME, constant_1.AUTH_SERVICE_RELATION_TYPE_PTR_LST);
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
                            userName: userCreated.info.userName.get(),
                            password: userCreated.info.password.get(),
                            telephone: userCreated.info.telephone.get(),
                            info: userCreated.info.info.get(),
                            userType: userCreated.info.userType.get(),
                        };
                        // await this.logService.createLog(userCreated, 'AdminLogs', 'Create', 'Create Valid', "create Valid");
                        return infoObject;
                    }
                }
            }
        });
    }
    updateAuthAdmin(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(constant_1.USER_LIST);
            const users = yield context.getChildren(constant_1.AUTH_SERVICE_USER_RELATION_NAME);
            var userObject;
            for (const user of users) {
                if (user.getName().get() === requestBody.userName) {
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
                                if (requestBody.telephone !== undefined) {
                                    user.info.telephone.set(requestBody.telephone);
                                }
                                if (requestBody.info !== undefined) {
                                    user.info.info.set(requestBody.info);
                                }
                                userObject = {
                                    id: user.getId().get(),
                                    type: user.getType().get(),
                                    name: user.getName().get(),
                                    userName: user.info.userName.get(),
                                    password: user.info.password.get(),
                                    email: user.info.email.get(),
                                    telephone: user.info.telephone.get(),
                                    info: user.info.info.get(),
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
    getAuthAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    const users = yield context.getChildren(constant_1.AUTH_SERVICE_USER_RELATION_NAME);
                    for (const user of users) {
                        if (user.getName().get() === 'authAdmin') {
                            var userObject = {
                                id: user.getId().get(),
                                type: user.getType().get(),
                                name: user.getName().get(),
                                userName: user.info.userName.get(),
                                password: user.info.password.get(),
                                email: user.info.email.get(),
                                telephone: user.info.telephone.get(),
                                info: user.info.info.get(),
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
                    let tokens = yield context.getChildren(constant_1.AUTH_SERVICE_TOKEN_RELATION_NAME);
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
            return [{ name: 'Super User' }, { name: 'Simple User' }];
        });
    }
    getUserLogs(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var logArrayList = [];
            var found = false;
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.USER_LIST) {
                    const platforms = yield context.getChildren(constant_1.AUTH_SERVICE_USER_RELATION_NAME);
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
            yield user.removeChild(arrdlt, 'HasUserProfile', constant_1.AUTH_SERVICE_RELATION_TYPE_PTR_LST);
        }
        for (const arrcrt of arrayCreate) {
            const realNode = yield getrealNodeProfile(arrcrt.userProfile.userProfileAdminId, arrcrt.platformId, graph);
            yield user.addChild(realNode, 'HasUserProfile', constant_1.AUTH_SERVICE_RELATION_TYPE_PTR_LST);
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
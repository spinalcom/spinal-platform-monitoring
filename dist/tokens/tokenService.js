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
exports.TokensService = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const operation_error_1 = require("../utilities/operation-error");
const http_status_code_1 = require("../utilities/http-status-code");
const spinalMiddleware_1 = require("../spinalMiddleware");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class TokensService {
    constructor() {
        this.spinalMiddleware = spinalMiddleware_1.default.getInstance();
        this.spinalMiddleware.init();
        this.graph = this.spinalMiddleware.getGraph();
    }
    createTokenTree() {
        return __awaiter(this, void 0, void 0, function* () {
            let promises = [];
            const context = yield this.graph.getContext(constant_1.TOKEN_LIST);
            const userTokenGroupObject = {
                type: constant_1.USER_TOKEN_CATEGORY_TYPE,
                name: 'User Token',
            };
            const applicationTokenGroupObject = {
                type: constant_1.APPLICATION_TOKEN_CATEGORY_TYPE,
                name: 'Application Token',
            };
            const userTokenCategoryId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(userTokenGroupObject, undefined);
            const applicationTokenCategoryId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(applicationTokenGroupObject, undefined);
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(context.getId().get(), userTokenCategoryId, context.getId().get(), constant_1.MONITORING_SERVICE_TOKEN_CATEGORY_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
            yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(context.getId().get(), applicationTokenCategoryId, context.getId().get(), constant_1.MONITORING_SERVICE_TOKEN_CATEGORY_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
        });
    }
    verify() {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.TOKEN_LIST) {
                    const categoriesToken = yield context.getChildren('HasCategoryToken');
                    for (const category of categoriesToken) {
                        const tokens = yield category.getChildren('HasToken');
                        for (const token of tokens) {
                            if (Math.floor(Date.now() / 1000) > token.info.expieredToken.get()) {
                                yield token.removeFromGraph();
                            }
                        }
                    }
                }
            }
        });
    }
    getTokens() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this.graph.getContext(constant_1.TOKEN_LIST);
            const categoriesToken = yield context.getChildren('HasCategoryToken');
            var tokenList = [];
            for (const category of categoriesToken) {
                if (category.getName().get() === "User Token") {
                    const categoryTokens = yield category.getChildren('HasToken');
                    for (const token of categoryTokens) {
                        let info = {
                            id: token.getId().get(),
                            type: token.getType().get(),
                            name: token.getName().get(),
                            token: token.info.token.get(),
                            createdToken: token.info.createdToken.get(),
                            expieredToken: token.info.expieredToken.get(),
                            userId: token.info.userId.get(),
                            userType: (_a = token.info.userType) === null || _a === void 0 ? void 0 : _a.get(),
                        };
                        tokenList.push(info);
                    }
                }
                else if (category.getName().get() === "Application Token") {
                    const categoryTokens = yield category.getChildren('HasToken');
                    for (const token of categoryTokens) {
                        let info = {
                            id: token.getId().get(),
                            type: token.getType().get(),
                            name: token.getName().get(),
                            token: token.info.token.get(),
                            createdToken: token.info.createdToken.get(),
                            expieredToken: token.info.expieredToken.get(),
                            applicationId: token.info.applicationId.get(),
                        };
                        tokenList.push(info);
                    }
                }
            }
            return tokenList;
        });
    }
    getUserTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this.graph.getContext(constant_1.TOKEN_LIST);
            const categoriesToken = yield context.getChildren('HasCategoryToken');
            var tokenList = [];
            for (const category of categoriesToken) {
                if (category.getName().get() === 'User Token') {
                    const categoryTokens = yield category.getChildren('HasToken');
                    for (const token of categoryTokens) {
                        let info = {
                            id: token.getId().get(),
                            type: token.getType().get(),
                            name: token.getName().get(),
                            token: token.info.token.get(),
                            createdToken: token.info.createdToken.get(),
                            expieredToken: token.info.expieredToken.get(),
                            userId: token.info.userId.get(),
                            userType: token.info.userType.get(),
                        };
                        tokenList.push(info);
                    }
                }
            }
            return tokenList;
        });
    }
    getApplicationTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this.graph.getContext(constant_1.TOKEN_LIST);
            const categoriesToken = yield context.getChildren('HasCategoryToken');
            var tokenList = [];
            for (const category of categoriesToken) {
                if (category.getName().get() === 'Application Token') {
                    const categoryTokens = yield category.getChildren('HasToken');
                    for (const token of categoryTokens) {
                        let info = {
                            id: token.getId().get(),
                            type: token.getType().get(),
                            name: token.getName().get(),
                            token: token.info.token.get(),
                            createdToken: token.info.createdToken.get(),
                            expieredToken: token.info.expieredToken.get(),
                            userId: token.info.userId.get(),
                            userType: token.info.userType.get(),
                        };
                        tokenList.push(info);
                    }
                }
            }
            return tokenList;
        });
    }
    getUserProfileByToken(Token, platformId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.TOKEN_LIST) {
                    const categoriesToken = yield context.getChildren('HasCategoryToken');
                    for (const category of categoriesToken) {
                        if (category.getName().get() === "User Token") {
                            const tokens = yield category.getChildren('HasToken');
                            for (const token of tokens) {
                                if (token.info.token.get() === Token) {
                                    if (token.info.platformList.get()) {
                                        for (const platform of token.info.platformList.get()) {
                                            if (platform.platformId === platformId) {
                                                return {
                                                    token: Token,
                                                    platformId: platformId,
                                                    userProfileName: platform.userProfile.userProfileName,
                                                    userProfileBosConfigId: platform.userProfile.userProfileBosConfigId,
                                                };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    getAppProfileByToken(Token, platformId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.TOKEN_LIST) {
                    const categoriesToken = yield context.getChildren('HasCategoryToken');
                    for (const category of categoriesToken) {
                        if (category.getName().get() === "Application Token") {
                            const tokens = yield category.getChildren('HasToken');
                            for (const token of tokens) {
                                if (token.info.token.get() === Token) {
                                    if (token.info.platformList.get()) {
                                        for (const platform of token.info.platformList.get()) {
                                            if (platform.platformId === platformId) {
                                                return {
                                                    token: Token,
                                                    platformId: platformId,
                                                    appProfileName: platform.appProfile.appProfileName,
                                                    appProfileBosConfigId: platform.appProfile.appProfileBosConfigId,
                                                };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    verifyToken(tokenParam, actor) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundUser = false, foundeApplication = false;
            const context = yield this.graph.getContext(constant_1.TOKEN_LIST);
            const categoriesToken = yield context.getChildren('HasCategoryToken');
            for (const category of categoriesToken) {
                if (actor === "user" && category.getName().get() === "User Token") {
                    const categoryTokens = yield category.getChildren('HasToken');
                    for (const token of categoryTokens) {
                        if (token.info.token.get() === tokenParam) {
                            foundUser = true;
                            if (Math.floor(Date.now() / 1000) < token.info.expieredToken.get()) {
                                let info = {
                                    token: token.info.token.get(),
                                    createdToken: token.info.createdToken.get(),
                                    expieredToken: token.info.expieredToken.get(),
                                    status: 'token valid'
                                };
                                return info;
                            }
                            else {
                                throw new operation_error_1.OperationError('TOKEN_EXPIRED', http_status_code_1.HttpStatusCode.UNAUTHORIZED);
                            }
                        }
                    }
                    if (foundUser === false) {
                        throw new operation_error_1.OperationError('UNKNOWN_TOKEN', http_status_code_1.HttpStatusCode.UNAUTHORIZED);
                    }
                }
                else if (actor === "application" && category.getName().get() === "Application Token") {
                    const categoryTokens = yield category.getChildren('HasToken');
                    for (const token of categoryTokens) {
                        if (token.info.token.get() === tokenParam) {
                            foundeApplication = true;
                            if (Math.floor(Date.now() / 1000) < token.info.expieredToken.get()) {
                                let info = {
                                    token: token.info.token.get(),
                                    createdToken: token.info.createdToken.get(),
                                    expieredToken: token.info.expieredToken.get(),
                                    status: 'token valid'
                                };
                                return info;
                            }
                            else {
                                throw new operation_error_1.OperationError('TOKEN_EXPIRED', http_status_code_1.HttpStatusCode.UNAUTHORIZED);
                            }
                        }
                    }
                    if (foundeApplication === false) {
                        throw new operation_error_1.OperationError('UNKNOWN_TOKEN', http_status_code_1.HttpStatusCode.UNAUTHORIZED);
                    }
                }
            }
        });
    }
}
exports.TokensService = TokensService;
// 'UNKNOWN_TOKEN'
// 'TOKEN_EXPIRED'
//# sourceMappingURL=tokenService.js.map
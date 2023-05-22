"use strict";
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
exports.ProfileServices = void 0;
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
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinalMiddleware_1 = require("../spinalMiddleware");
class ProfileServices {
    constructor() {
        this.spinalMiddleware = spinalMiddleware_1.default.getInstance();
        this.spinalMiddleware.init();
        this.graph = this.spinalMiddleware.getGraph();
    }
    createUserProfileService(userProfileCreationParms) {
        return __awaiter(this, void 0, void 0, function* () {
            const platformContext = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext('platformList');
            const userProfileObject = {
                userProfileId: userProfileCreationParms.userProfileId,
                name: userProfileCreationParms.name,
                type: constant_1.USER_PROFILE_TYPE,
                platformId: userProfileCreationParms.platformId,
            };
            const nodeUserId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(userProfileObject, undefined);
            const platforms = yield platformContext.getChildren('HasPlatform');
            for (const platform of platforms) {
                if (platform.getId().get() === userProfileObject.platformId) {
                    //@ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(platform);
                    var res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(platform.getId().get(), nodeUserId, platformContext.getId().get(), constant_1.MONITORING_SERVICE_USER_PROFILE_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
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
        });
    }
    createAppProfileService(appProfileCreationParms) {
        return __awaiter(this, void 0, void 0, function* () {
            const platformContext = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext('platformList');
            const appProfileObject = {
                appProfileId: appProfileCreationParms.appProfileId,
                name: appProfileCreationParms.name,
                type: constant_1.APP_PROFILE_TYPE,
                platformId: appProfileCreationParms.platformId,
            };
            const nodeAppId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(appProfileObject, undefined);
            const platforms = yield platformContext.getChildren('HasPlatform');
            for (const platform of platforms) {
                if (platform.getId().get() === appProfileObject.platformId) {
                    //@ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(platform);
                    var res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(platform.getId().get(), nodeAppId, platformContext.getId().get(), constant_1.MONITORING_SERVICE_APP_PROFILE_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
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
        });
    }
    getUserProfileService(platformId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const platformContext = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext('platformList');
                var userProfileObjectList = [];
                const platforms = yield platformContext.getChildren('HasPlatform');
                for (const platform of platforms) {
                    if (platform.getId().get() === platformId) {
                        //@ts-ignore
                        spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(platform);
                        var userProfileList = yield platform.getChildren('HasUserProfile');
                        for (const userProfile of userProfileList) {
                            var UserProfileObject = {
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
            }
            catch (error) {
                return error;
            }
        });
    }
    getAppProfileService(platformId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const platformContext = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext('platformList');
                var appProfileObjectList = [];
                const platforms = yield platformContext.getChildren('HasPlatform');
                for (const platform of platforms) {
                    if (platform.getId().get() === platformId) {
                        //@ts-ignore
                        spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(platform);
                        var appProfileList = yield platform.getChildren('HasAppProfile');
                        for (const appProfile of appProfileList) {
                            var AppProfileObject = {
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
            }
            catch (error) {
                return error;
            }
        });
    }
}
exports.ProfileServices = ProfileServices;
//# sourceMappingURL=profileServices.js.map
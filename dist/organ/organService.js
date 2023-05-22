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
exports.OrganService = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const operation_error_1 = require("../utilities/operation-error");
const http_status_code_1 = require("../utilities/http-status-code");
const spinalMiddleware_1 = require("../spinalMiddleware");
class OrganService {
    constructor() {
        this.spinalMiddleware = spinalMiddleware_1.default.getInstance();
        this.spinalMiddleware.init();
        this.graph = this.spinalMiddleware.getGraph();
    }
    createOrgan(organCreationParms) {
        return __awaiter(this, void 0, void 0, function* () {
            const platformContext = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext('platformList');
            const organObject = {
                name: organCreationParms.name,
                type: constant_1.ORGAN_TYPE,
                organType: organCreationParms.organType,
                statusOrgan: '',
                platformId: organCreationParms.platformId,
            };
            const OrganId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(organObject, undefined);
            const platforms = yield platformContext.getChildren('HasPlatform');
            for (const platform of platforms) {
                if (platform.getId().get() === organCreationParms.platformId) {
                    //@ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(platform);
                    var res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(platform.getId().get(), OrganId, platformContext.getId().get(), constant_1.MONITORING_SERVICE_ORGAN_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
                }
            }
            if (res !== undefined) {
                return {
                    id: res.getId().get(),
                    name: res.getName().get(),
                    type: res.getType().get(),
                    statusOrgan: res.info.statusOrgan.get(),
                    organType: res.info.organType.get(),
                    platformId: res.info.platformId.get(),
                };
            }
        });
    }
    getOrgans(platformId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var organsObjectList = [];
                const contexts = yield this.graph.getChildren('hasContext');
                for (const context of contexts) {
                    if (context.getName().get() === constant_1.PLATFORM_LIST) {
                        const platforms = yield context.getChildren(constant_1.MONITORING_SERVICE_PLATFORM_RELATION_NAME);
                        for (const platform of platforms) {
                            if (platform.getId().get() === platformId) {
                                var organs = yield platform.getChildren('HasOrgan');
                                for (const organ of organs) {
                                    var OrganObject = {
                                        id: organ.getId().get(),
                                        type: organ.getType().get(),
                                        name: organ.getName().get(),
                                        statusOrgan: organ.info.statusOrgan.get(),
                                        organType: organ.info.organType.get(),
                                        platformId: organ.info.platformId.get(),
                                    };
                                    organsObjectList.push(OrganObject);
                                }
                            }
                        }
                    }
                }
                return organsObjectList;
            }
            catch (error) {
                return error;
            }
        });
    }
    getOrgan(platformId, organId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.PLATFORM_LIST) {
                    const platforms = yield context.getChildren(constant_1.MONITORING_SERVICE_PLATFORM_RELATION_NAME);
                    for (const platform of platforms) {
                        if (platform.getId().get() === platformId) {
                            var organs = yield platform.getChildren('HasOrgan');
                            for (const organ of organs) {
                                if (organ.getId().get() === organId) {
                                    var OrganObject = {
                                        id: organ.getId().get(),
                                        type: organ.getType().get(),
                                        name: organ.getName().get(),
                                        statusOrgan: organ.info.statusOrgan.get(),
                                        organType: organ.info.organType.get(),
                                        platformId: organ.info.platformId.get(),
                                    };
                                }
                            }
                        }
                    }
                    if (OrganObject) {
                        return OrganObject;
                    }
                    else {
                        throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
                    }
                }
            }
        });
    }
    updateOrgan(organId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.PLATFORM_LIST) {
                    const platforms = yield context.getChildren(constant_1.MONITORING_SERVICE_PLATFORM_RELATION_NAME);
                    for (const platform of platforms) {
                        if (platform.getId().get() === requestBody.platformId) {
                            var organs = yield platform.getChildren('HasOrgan');
                            for (const organ of organs) {
                                if (organ.getId().get() === organId) {
                                    organ.info.name.set(requestBody.name);
                                    organ.info.organType.set(requestBody.organType);
                                    organ.info.statusOrgan.set(requestBody.statusOrgan);
                                    var OrganObject = {
                                        id: organ.getId().get(),
                                        type: organ.getType().get(),
                                        name: organ.getName().get(),
                                        statusOrgan: organ.info.statusOrgan.get(),
                                        organType: organ.info.organType.get(),
                                        platformId: organ.info.platformId.get(),
                                    };
                                }
                            }
                        }
                    }
                }
            }
            if (OrganObject !== undefined)
                return OrganObject;
            else
                throw new operation_error_1.OperationError('NOT_FOUND', http_status_code_1.HttpStatusCode.NOT_FOUND);
        });
    }
    deleteOrgan(platformId, organId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.graph.getChildren('hasContext');
            for (const context of contexts) {
                if (context.getName().get() === constant_1.PLATFORM_LIST) {
                    const platforms = yield context.getChildren(constant_1.MONITORING_SERVICE_PLATFORM_RELATION_NAME);
                    for (const platform of platforms) {
                        if (platform.getId().get() === platformId) {
                            var organs = yield platform.getChildren('HasOrgan');
                            for (const organ of organs) {
                                if (organ.getId().get() === organId) {
                                    spinal_env_viewer_graph_service_1.SpinalGraphService.removeFromGraph(organ.getId().get());
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}
exports.OrganService = OrganService;
//# sourceMappingURL=organService.js.map
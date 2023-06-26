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
const spinalMiddleware_1 = require("../spinalMiddleware");
class OrganService {
    constructor() {
        this.spinalMiddleware = spinalMiddleware_1.default.getInstance();
        this.spinalMiddleware.init();
        this.graph = this.spinalMiddleware.getGraph();
    }
    createOrgan(organCreationParms) {
        return __awaiter(this, void 0, void 0, function* () {
            const oragnListContext = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext('organList');
            const organObject = {
                name: organCreationParms.name,
                type: constant_1.ORGAN_TYPE,
                organType: organCreationParms.organType,
                statusOrgan: organCreationParms.statusOrgan,
                bootTimestamp: organCreationParms.bootTimestamp,
                lastHealthTime: organCreationParms.lastHealthTime,
                ramHeapUsed: organCreationParms.ramHeapUsed,
                ipAdress: organCreationParms.ipAdress,
                port: organCreationParms.port,
                protocol: organCreationParms.protocol,
                platformId: organCreationParms.platformId,
            };
            const OrganId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(organObject, undefined);
            var res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(oragnListContext.getId().get(), OrganId, oragnListContext.getId().get(), constant_1.MONITORING_SERVICE_ORGAN_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
            const platformListContext = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext('platformList');
            const platforms = yield platformListContext.getChildren('HasPlatform');
            for (const platform of platforms) {
                if (platform.getId().get() === organCreationParms.platformId) {
                    //@ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(platform);
                    yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChild(platform.getId().get(), OrganId, constant_1.MONITORING_SERVICE_ORGAN_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
                    var res = yield spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(platform.getId().get(), OrganId, oragnListContext.getId().get(), constant_1.MONITORING_SERVICE_ORGAN_RELATION_NAME, constant_1.MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
                }
            }
            if (res !== undefined) {
                return {
                    id: res.getId().get(),
                    name: res.getName().get(),
                    type: res.getType().get(),
                    statusOrgan: res.info.statusOrgan.get(),
                    bootTimestamp: res.info.bootTimestamp.get(),
                    lastHealthTime: res.info.lastHealthTime.get(),
                    ramHeapUsed: res.info.ramHeapUsed.get(),
                    ipAdress: res.info.ipAdress.get(),
                    port: res.info.port.get(),
                    protocol: res.info.protocol.get(),
                    organType: res.info.organType.get(),
                    platformId: res.info.platformId.get(),
                };
            }
        });
    }
    getOrgans() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var organsObjectList = [];
                const context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext('organList');
                const organs = yield context.getChildren(constant_1.MONITORING_SERVICE_ORGAN_RELATION_NAME);
                for (const organ of organs) {
                    var OrganObject = {
                        id: organ.getId().get(),
                        type: organ.getType().get(),
                        name: organ.getName().get(),
                        bootTimestamp: organ.info.bootTimestamp.get(),
                        lastHealthTime: organ.info.lastHealthTime.get(),
                        ramHeapUsed: organ.info.ramHeapUsed.get(),
                        statusOrgan: organ.info.statusOrgan.get(),
                        organType: organ.info.organType.get(),
                        platformId: organ.info.platformId.get(),
                        ipAdress: organ.info.ipAdress.get(),
                        port: organ.info.port.get(),
                        protocol: organ.info.protocol.get(),
                    };
                    organsObjectList.push(OrganObject);
                }
                return organsObjectList;
            }
            catch (error) {
                return error;
            }
        });
    }
    // public async getOrgan(platformId: string, organId: string): Promise<IOrgan> {
    //   const contexts = await this.graph.getChildren('hasContext');
    //   for (const context of contexts) {
    //     if (context.getName().get() === PLATFORM_LIST) {
    //       const platforms = await context.getChildren(
    //         MONITORING_SERVICE_PLATFORM_RELATION_NAME
    //       );
    //       for (const platform of platforms) {
    //         if (platform.getId().get() === platformId) {
    //           var organs = await platform.getChildren('HasOrgan');
    //           for (const organ of organs) {
    //             if (organ.getId().get() === organId) {
    //               var OrganObject: IOrgan = {
    //                 id: organ.getId().get(),
    //                 type: organ.getType().get(),
    //                 name: organ.getName().get(),
    //                 statusOrgan: organ.info.statusOrgan.get(),
    //                 organType: organ.info.organType.get(),
    //                 platformId: organ.info.platformId.get(),
    //               };
    //             }
    //           }
    //         }
    //       }
    //       if (OrganObject) {
    //         return OrganObject;
    //       } else {
    //         throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    //       }
    //     }
    //   }
    // }
    // public async updateOrgan(
    //   organId: string,
    //   requestBody: IOrganUpdateParams
    // ): Promise<IOrgan> {
    //   const contexts = await this.graph.getChildren('hasContext');
    //   for (const context of contexts) {
    //     if (context.getName().get() === PLATFORM_LIST) {
    //       const platforms = await context.getChildren(
    //         MONITORING_SERVICE_PLATFORM_RELATION_NAME
    //       );
    //       for (const platform of platforms) {
    //         if (platform.getId().get() === requestBody.platformId) {
    //           var organs = await platform.getChildren('HasOrgan');
    //           for (const organ of organs) {
    //             if (organ.getId().get() === organId) {
    //               organ.info.name.set(requestBody.name);
    //               organ.info.organType.set(requestBody.organType);
    //               organ.info.statusOrgan.set(requestBody.statusOrgan);
    //               var OrganObject: IOrgan = {
    //                 id: organ.getId().get(),
    //                 type: organ.getType().get(),
    //                 name: organ.getName().get(),
    //                 statusOrgan: organ.info.statusOrgan.get(),
    //                 organType: organ.info.organType.get(),
    //                 platformId: organ.info.platformId.get(),
    //               };
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    //   if (OrganObject !== undefined) return OrganObject;
    //   else throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    // }
    deleteOrgan(organId) {
        return __awaiter(this, void 0, void 0, function* () {
            const organListContext = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext('organList');
            const organs = yield organListContext.getChildren(constant_1.MONITORING_SERVICE_ORGAN_RELATION_NAME);
            for (const organ of organs) {
                if (organ.getId().get() === organId) {
                    spinal_env_viewer_graph_service_1.SpinalGraphService.removeFromGraph(organ.getId().get());
                }
            }
        });
    }
}
exports.OrganService = OrganService;
//# sourceMappingURL=organService.js.map
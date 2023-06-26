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
exports.AuthGraphService = void 0;
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
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
class AuthGraphService {
    constructor(graph) {
        this.graph = graph;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let promises = [];
            var userList;
            var platformList;
            var tokenList;
            var infoMonitoring;
            var logs;
            var notifications;
            var serverList;
            var organList;
            if ((yield this.graph.getContext(constant_1.USER_LIST)) === undefined) {
                userList = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.USER_LIST);
                promises.push(this.graph.addContext(userList));
            }
            if ((yield this.graph.getContext(constant_1.SERVER_LIST)) === undefined) {
                serverList = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.SERVER_LIST);
                promises.push(this.graph.addContext(serverList));
            }
            if ((yield this.graph.getContext(constant_1.PLATFORM_LIST)) === undefined) {
                platformList = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.PLATFORM_LIST);
                promises.push(this.graph.addContext(platformList));
            }
            if ((yield this.graph.getContext(constant_1.TOKEN_LIST)) === undefined) {
                tokenList = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.TOKEN_LIST);
                promises.push(this.graph.addContext(tokenList));
            }
            if ((yield this.graph.getContext(constant_1.INFO_MONITORING)) === undefined) {
                infoMonitoring = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.INFO_MONITORING);
                promises.push(this.graph.addContext(infoMonitoring));
            }
            if ((yield this.graph.getContext(constant_1.LOG_LIST)) === undefined) {
                logs = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.LOG_LIST);
                promises.push(this.graph.addContext(logs));
            }
            if ((yield this.graph.getContext(constant_1.NOTIFICATION_LIST)) === undefined) {
                notifications = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.NOTIFICATION_LIST);
                promises.push(this.graph.addContext(notifications));
            }
            if ((yield this.graph.getContext(constant_1.ORGAN_LIST)) === undefined) {
                organList = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.ORGAN_LIST);
                promises.push(this.graph.addContext(organList));
            }
            return Promise.all(promises).then(() => {
                return this.graph;
            });
        });
    }
}
exports.AuthGraphService = AuthGraphService;
//# sourceMappingURL=authGraphService.js.map
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
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_model_graph_1 = require("spinal-model-graph");
const utilitiesFunctions_1 = require("./utilities/utilitiesFunctions");
const config_1 = require("./config");
class SpinalMiddleware {
    static getInstance() {
        if (SpinalMiddleware.instance === null) {
            SpinalMiddleware.instance = new SpinalMiddleware();
        }
        return SpinalMiddleware.instance;
    }
    constructor() {
        // connection string to connect to spinalhub
        const connect_opt = `http://${config_1.default.spinalConnector.user}:${config_1.default.spinalConnector.password}@${config_1.default.spinalConnector.host}:${config_1.default.spinalConnector.port}/`;
        // initialize the connection
        this.conn = spinal_core_connectorjs_type_1.spinalCore.connect(connect_opt);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                // get the Model from the spinalhub, "onLoadSuccess" and "onLoadError" are 2
                // callback function.
                spinal_core_connectorjs_type_1.spinalCore.load(this.conn, '/__users__/admin/MONITORING_config', this.onLoadSuccess.bind(this, resolve), this.onLoadError.bind(this, resolve, reject));
            });
        });
    }
    onLoadError(resolve, reject) {
        const graph = new spinal_model_graph_1.SpinalGraph();
        (0, utilitiesFunctions_1.store)(this.conn, graph, '/__users__/admin/MONITORING_config', () => {
            this.onLoadSuccess(resolve, graph);
        }, () => {
            reject('IS NOT ABLE TO CONNECT TO HUB');
        });
    }
    onLoadSuccess(resolve, graph) {
        spinal_env_viewer_graph_service_1.SpinalGraphService.setGraph(graph);
        resolve();
    }
    getGraph() {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.getGraph();
    }
}
SpinalMiddleware.instance = null;
exports.default = SpinalMiddleware;
//# sourceMappingURL=spinalMiddleware.js.map
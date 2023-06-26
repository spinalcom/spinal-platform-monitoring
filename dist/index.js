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
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
// import { AuthGraphService } from './services/authGraphService';
const userService_1 = require("./monitoringUser/userService");
const platformServices_1 = require("./platform/platformServices");
const tokenService_1 = require("./tokens/tokenService");
// import { LogsService } from './logs/logService'
const server_1 = require("./server");
const spinalMiddleware_1 = require("./spinalMiddleware");
const constant_1 = require("./constant");
const authGraphService_1 = require("./services/authGraphService");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const spinalMiddleware = spinalMiddleware_1.default.getInstance();
        yield spinalMiddleware.init();
        console.log('connection to hub initialize ...');
        const authGraphService = new authGraphService_1.AuthGraphService(spinalMiddleware.getGraph());
        yield authGraphService.init();
        const contexts = yield spinalMiddleware.getGraph().getChildren('hasContext');
        // config token context
        var tokensService = new tokenService_1.TokensService();
        for (const context of contexts) {
            if (context.getName().get() === 'tokenList') {
                // @ts-ignore
                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(context);
                const childsContext = yield context.getChildren(constant_1.MONITORING_SERVICE_TOKEN_CATEGORY_RELATION_NAME);
                if (childsContext.length === 0) {
                    yield tokensService.createTokenTree();
                }
            }
        }
        //verification user
        for (const context of contexts) {
            if (context.getName().get() === 'userList') {
                // @ts-ignore
                spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(context);
                const childsContext = yield context.getChildren(constant_1.MONITORING_SERVICE_USER_RELATION_NAME);
                if (childsContext.length === 0) {
                    const userService = new userService_1.UserService();
                    let res = yield userService.createMonitoringAdmin();
                    if (res !== undefined) {
                        console.log('Monitoring Admin created ...');
                    }
                }
            }
        }
        // start organ with platform config
        var plateformsService = new platformServices_1.PlatformService();
        var plateforms = yield plateformsService.getPlateforms();
        if (plateforms.length === 0) {
            let res = yield plateformsService.createOrUpdateMonitoringPlateform();
            if (res !== undefined) {
                console.log('Monitoring Platform created ...');
            }
        }
        // start organ with register key config
        var plateformsService = new platformServices_1.PlatformService();
        for (const context of contexts) {
            if (context.getName().get() === 'infoMonitoring') {
                let nodes = yield context.getChildren(constant_1.MONITORING_SERVICE_INFO_RELATION_NAME);
                if (nodes.length === 0) {
                    let res = yield plateformsService.createRegisterKeyNode();
                    if (res !== undefined) {
                        console.log('register key created ...', res);
                    }
                }
            }
        }
        // start organ with token cron
        // var cron = require('node-cron');
        // cron.schedule('0-9 1 1 * * *', async function () {
        //   await tokensService.verify();
        // });
    });
}
main();
(0, server_1.default)();
//# sourceMappingURL=index.js.map
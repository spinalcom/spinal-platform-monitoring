/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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

import {
  SERVER_TYPE,
  PLATFORM_LIST,
  MONITORING_SERVICE_RELATION_TYPE_PTR_LST,
  MONITORING_SERVICE_SERVER_RELATION_NAME,
  CATEGORY_NAME
} from '../constant';
import {
  SpinalGraphService,
  SpinalGraph,
} from 'spinal-env-viewer-graph-service';
import { OperationError } from '../utilities/operation-error';
import { HttpStatusCode } from '../utilities/http-status-code';
import {
  IServer,
  IServerCreationParams,
  IServerUpdateParams
} from './server.model';
import SpinalMiddleware from '../spinalMiddleware';
import serviceDocumentation from "spinal-env-viewer-plugin-documentation-service"
import { InputDataEndpoint, InputDataEndpointDataType, InputDataEndpointType } from 'spinal-model-bmsnetwork';
import getInstance from '../utilities/NetworkService';

export class ServerService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }


  public async createServer(serverCreationParms: IServerCreationParams
  ): Promise<IServer> {
    const context = SpinalGraphService.getContext('serverList');
    const serverObject: IServerCreationParams = {
      type: SERVER_TYPE,
      name: serverCreationParms.name,
      ipAdress: serverCreationParms.ipAdress,
      macAdress: serverCreationParms.macAdress,
      sshLogin: serverCreationParms.sshLogin,
      sshPassword: serverCreationParms.sshPassword,
      boot_timestamp: serverCreationParms.boot_timestamp,
      last_health_time: serverCreationParms.last_health_time,
      serverType: serverCreationParms.serverType,
      [Symbol.iterator]: function* () {
        let properties = Object.keys(this);
        for (let i of properties) {
          yield [i, this[i]];
        }
      }
    };
    const ServerId = SpinalGraphService.createNode(serverObject, undefined);

    var res = await SpinalGraphService.addChildInContext(
      context.getId().get(),
      ServerId,
      context.getId().get(),
      MONITORING_SERVICE_SERVER_RELATION_NAME,
      MONITORING_SERVICE_RELATION_TYPE_PTR_LST
    );
    const category = await serviceDocumentation.addCategoryAttribute(res, CATEGORY_NAME)
    for (const [key, value] of serverObject) {
      await serviceDocumentation.addAttributeByCategoryName(res, category.nameCat, key, value)
    }

    const rebootObj: InputDataEndpoint = {
      id: "0",
      name: "reboot_history",
      path: "",
      currentValue: serverCreationParms.boot_timestamp,
      unit: 'timestamp',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Date,
      type: InputDataEndpointType.Other,
    };
    const RamObj: InputDataEndpoint = {
      id: "0",
      name: "ram_history",
      path: "",
      currentValue: 0,
      unit: 'mgo',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Integer,
      type: InputDataEndpointType.Other,
    };
    const usedProcObj: InputDataEndpoint = {
      id: "0",
      name: "usedProc_history",
      path: "",
      currentValue: 0,
      unit: 'pourcentage',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Integer,
      type: InputDataEndpointType.Other,
    };
    const cacheObj: InputDataEndpoint = {
      id: "0",
      name: "usedProc_history",
      path: "",
      currentValue: 0,
      unit: 'cache',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Integer,
      type: InputDataEndpointType.Other,
    };
    const swapObj: InputDataEndpoint = {
      id: "0",
      name: "swap_history",
      path: "",
      currentValue: 0,
      unit: 'swap',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Date,
      type: InputDataEndpointType.Other,
    };
    const DDObj: InputDataEndpoint = {
      id: "0",
      name: "DD_history",
      path: "",
      currentValue: 0,
      unit: 'DD',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Date,
      type: InputDataEndpointType.Other,
    };
    const fluxObj: InputDataEndpoint = {
      id: "0",
      name: "flux_history",
      path: "",
      currentValue: 0,
      unit: 'flux',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Date,
      type: InputDataEndpointType.Other,
    };
    await getInstance().createNewBmsEndpointWithoutContext(ServerId, rebootObj);
    await getInstance().createNewBmsEndpointWithoutContext(ServerId, RamObj);
    await getInstance().createNewBmsEndpointWithoutContext(ServerId, usedProcObj);
    await getInstance().createNewBmsEndpointWithoutContext(ServerId, cacheObj);
    await getInstance().createNewBmsEndpointWithoutContext(ServerId, swapObj);
    await getInstance().createNewBmsEndpointWithoutContext(ServerId, DDObj);
    await getInstance().createNewBmsEndpointWithoutContext(ServerId, fluxObj);
    if (res !== undefined) {
      return {
        id: res.getId().get(),
        type: res.getType().get(),
        name: res.getName().get(),
        ipAdress: res.info.ipAdress.get(),
        macAdress: res.info.macAdress.get(),
        sshLogin: res.info.sshLogin.get(),
        sshPassword: res.info.sshPassword.get(),
        boot_timestamp: res.info.boot_timestamp.get(),
        last_health_time: res.info.last_health_time.get(),
        serverType: res.info.serverType.get(),
      };
    }
  }



  // public async updateServer(serverId: string, serverUpdateParms: IServerUpdateParams
  // ): Promise<IServer> {
  //   const context = SpinalGraphService.getContext('serverList')
  //   const servers = await context.getChildren(
  //     MONITORING_SERVICE_SERVER_RELATION_NAME
  //   );
  //   for (const server of servers) {
  //     if (server.getId().get() === serverId) {

  //     }
  //   }







  //   if (res !== undefined) {
  //     return {
  //       id: res.getId().get(),
  //       type: res.getType().get(),
  //       name: res.getName().get(),
  //       ip: res.info.ip.get(),
  //       url: res.info.url.get(),
  //       sshLogin: res.info.sshLogin.get(),
  //       sshPassword: res.info.sshPassword.get(),
  //       serverType: res.info.serverType.get(),
  //       provider: res.info.provider.get(),
  //       state: {
  //         memory: res.info.state.memory.get(),
  //         cache: res.info.state.cache.get(),
  //         DD: res.info.state.DD.get(),
  //         proc: res.info.state.proc.get(),
  //       }
  //     };
  //   }

  // }







  // public async getServers(): Promise<IServer[]> {
  //   try {
  //     var serversObjectList = [];
  //     const context = SpinalGraphService.getContext('serverList')
  //     const servers = await context.getChildren(
  //       MONITORING_SERVICE_SERVER_RELATION_NAME
  //     );
  //     for (const server of servers) {
  //       var ServerObject: IServer = {
  //         id: server.getId().get(),
  //         type: server.getType().get(),
  //         name: server.getName().get(),
  //         ip: server.info.ip.get(),
  //         url: server.info.url.get(),
  //         sshLogin: server.info.sshLogin.get(),
  //         sshPassword: server.info.sshPassword.get(),
  //         serverType: server.info.serverType.get(),
  //         provider: server.info.provider.get(),
  //         state: {
  //           memory: server.info.state.memory.get(),
  //           cache: server.info.state.cache.get(),
  //           DD: server.info.state.DD.get(),
  //           proc: server.info.state.proc.get(),
  //         }
  //       };
  //       serversObjectList.push(ServerObject);
  //     }
  //     return serversObjectList;
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // public async getServer(serverId: string): Promise<IServer> {
  //   try {
  //     const context = SpinalGraphService.getContext('serverList')
  //     const servers = await context.getChildren(
  //       MONITORING_SERVICE_SERVER_RELATION_NAME
  //     );
  //     for (const server of servers) {
  //       if (server.getId().get() === serverId) {
  //         var ServerObject: IServer = {
  //           id: server.getId().get(),
  //           type: server.getType().get(),
  //           name: server.getName().get(),
  //           ip: server.info.ip.get(),
  //           url: server.info.url.get(),
  //           sshLogin: server.info.sshLogin.get(),
  //           sshPassword: server.info.sshPassword.get(),
  //           serverType: server.info.serverType.get(),
  //           provider: server.info.provider.get(),
  //           state: {
  //             memory: server.info.state.memory.get(),
  //             cache: server.info.state.cache.get(),
  //             DD: server.info.state.DD.get(),
  //             proc: server.info.state.proc.get(),
  //           }
  //         };
  //       }
  //     }
  //     return ServerObject;
  //   } catch (error) {
  //     return error;
  //   }
  // }


  // public async deleteServer(serverId: string): Promise<void> {
  //   const context = SpinalGraphService.getContext('serverList')
  //   const servers = await context.getChildren(
  //     MONITORING_SERVICE_SERVER_RELATION_NAME
  //   );
  //   for (const server of servers) {
  //     if (server.getId().get() === serverId) {
  //       await server.removeFromGraph()
  //     }
  //   }
  // }

}
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
  CATEGORY_NAME,
  SERVER_LIST
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
import spinalServiceTimeSeries from '../utilities/spinalTimeSeries';

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



  public async updateServer(serverId: string, requestBody: IServerUpdateParams
  ): Promise<IServer> {
    const context = SpinalGraphService.getContext(SERVER_LIST)
    const servers = await context.getChildren(
      MONITORING_SERVICE_SERVER_RELATION_NAME
    );
    for (const server of servers) {
      if (server.getId().get() === serverId) {
        const attrs = await serviceDocumentation.getAttributesByCategory(server, CATEGORY_NAME);
        for (const attr of attrs) {
          if (attr.label.get() === 'name') serviceDocumentation.setAttributeById(server, attr._server_id, 'name', requestBody.name, attr.type.get(), attr.unit.get())
          else if (attr.label.get() === 'ipAdress') serviceDocumentation.setAttributeById(server, attr._server_id, 'ipAdress', requestBody.ipAdress, attr.type.get(), attr.unit.get())
          else if (attr.label.get() === 'macAdress') serviceDocumentation.setAttributeById(server, attr._server_id, 'macAdress', requestBody.macAdress, attr.type.get(), attr.unit.get())
          else if (attr.label.get() === 'sshLogin') serviceDocumentation.setAttributeById(server, attr._server_id, 'sshLogin', requestBody.sshLogin, attr.type.get(), attr.unit.get())
          else if (attr.label.get() === 'sshPassword') serviceDocumentation.setAttributeById(server, attr._server_id, 'sshPassword', requestBody.sshPassword, attr.type.get(), attr.unit.get())
          else if (attr.label.get() === 'boot_timestamp') serviceDocumentation.setAttributeById(server, attr._server_id, 'boot_timestamp', requestBody.boot_timestamp, attr.type.get(), attr.unit.get())
          else if (attr.label.get() === 'last_health_time') serviceDocumentation.setAttributeById(server, attr._server_id, 'last_health_time', requestBody.last_health_time, attr.type.get(), attr.unit.get())
          else if (attr.label.get() === 'serverType') serviceDocumentation.setAttributeById(server, attr._server_id, 'serverType', requestBody.serverType, attr.type.get(), attr.unit.get())
        }

        const attrsres = await serviceDocumentation.getAttributesByCategory(server, CATEGORY_NAME);
        var customerObject: any = {}
        for (const attr of attrsres) {
          if (attr.label.get() === 'id') Object.assign(customerObject, { id: attr.value.get() });
          else if (attr.label.get() === 'type') Object.assign(customerObject, { type: attr.value.get() });
          else if (attr.label.get() === 'name') Object.assign(customerObject, { name: attr.value.get() });
          else if (attr.label.get() === 'ipAdress') Object.assign(customerObject, { ipAdress: attr.value.get() });
          else if (attr.label.get() === 'macAdress') Object.assign(customerObject, { macAdress: attr.value.get() });
          else if (attr.label.get() === 'sshLogin') Object.assign(customerObject, { sshLogin: attr.value.get() });
          else if (attr.label.get() === 'sshPassword') Object.assign(customerObject, { sshPassword: attr.value.get() });
          else if (attr.label.get() === 'boot_timestamp') Object.assign(customerObject, { boot_timestamp: attr.value.get() });
          else if (attr.label.get() === 'last_health_time') Object.assign(customerObject, { last_health_time: attr.value.get() });
          else if (attr.label.get() === 'serverType') Object.assign(customerObject, { serverType: attr.value.get() });
        }
      }
    }
    return customerObject;
  }







  public async getServers(): Promise<IServer[]> {
    try {
      var serversObjectList = [];
      const context = SpinalGraphService.getContext('serverList')
      const servers = await context.getChildren(
        MONITORING_SERVICE_SERVER_RELATION_NAME
      );
      const arrayServer: IServer[] = []



      for (const server of servers) {
        let serverObject: any = {}
        const attrs = await serviceDocumentation.getAttributesByCategory(server, CATEGORY_NAME);
        for (const attr of attrs) {
          if (attr.label.get() === 'id') Object.assign(serverObject, { id: attr.value.get() });
          else if (attr.label.get() === 'type') Object.assign(serverObject, { type: attr.value.get() });
          else if (attr.label.get() === 'name') Object.assign(serverObject, { name: attr.value.get() });
          else if (attr.label.get() === 'ipAdress') Object.assign(serverObject, { ipAdress: attr.value.get() });
          else if (attr.label.get() === 'macAdress') Object.assign(serverObject, { macAdress: attr.value.get() });
          else if (attr.label.get() === 'sshLogin') Object.assign(serverObject, { sshLogin: attr.value.get() });
          else if (attr.label.get() === 'sshPassword') Object.assign(serverObject, { sshPassword: attr.value.get() });
          else if (attr.label.get() === 'boot_timestamp') Object.assign(serverObject, { boot_timestamp: attr.value.get() });
          else if (attr.label.get() === 'last_health_time') Object.assign(serverObject, { last_health_time: attr.value.get() });
          else if (attr.label.get() === 'serverType') Object.assign(serverObject, { serverType: attr.value.get() });
        }
        arrayServer.push(serverObject);
      }
      return serversObjectList;
    } catch (error) {
      return error;
    }
  }

  public async getServer(serverId: string): Promise<IServer> {
    try {
      const context = SpinalGraphService.getContext('serverList')
      const servers = await context.getChildren(
        MONITORING_SERVICE_SERVER_RELATION_NAME
      );
      var serverObject: any = {}
      for (const server of servers) {
        if (server.getId().get() === serverId) {
          const attrs = await serviceDocumentation.getAttributesByCategory(server, CATEGORY_NAME);
          for (const attr of attrs) {
            if (attr.label.get() === 'id') Object.assign(serverObject, { id: attr.value.get() });
            else if (attr.label.get() === 'type') Object.assign(serverObject, { type: attr.value.get() });
            else if (attr.label.get() === 'name') Object.assign(serverObject, { name: attr.value.get() });
            else if (attr.label.get() === 'ipAdress') Object.assign(serverObject, { ipAdress: attr.value.get() });
            else if (attr.label.get() === 'macAdress') Object.assign(serverObject, { macAdress: attr.value.get() });
            else if (attr.label.get() === 'sshLogin') Object.assign(serverObject, { sshLogin: attr.value.get() });
            else if (attr.label.get() === 'sshPassword') Object.assign(serverObject, { sshPassword: attr.value.get() });
            else if (attr.label.get() === 'boot_timestamp') Object.assign(serverObject, { boot_timestamp: attr.value.get() });
            else if (attr.label.get() === 'last_health_time') Object.assign(serverObject, { last_health_time: attr.value.get() });
            else if (attr.label.get() === 'serverType') Object.assign(serverObject, { serverType: attr.value.get() });
          }
        }
      }
      return serverObject;
    } catch (error) {
      return error;
    }
  }

  public async deleteServer(serverId: string): Promise<void> {
    const context = SpinalGraphService.getContext('serverList')
    const servers = await context.getChildren(
      MONITORING_SERVICE_SERVER_RELATION_NAME
    );
    for (const server of servers) {
      if (server.getId().get() === serverId) {
        await server.removeFromGraph()
      }
    }
  }

  public async pushDataServer(requestBody: any) {
    const context = SpinalGraphService.getContext('serverList')
    const servers = await context.getChildren(
      MONITORING_SERVICE_SERVER_RELATION_NAME
    );
    for (const server of servers) {
      const endpoints = await server.getChildren('hasBmsEndpoint')
      for (const endpoint of endpoints) {
        if (endpoint.getName().get() === 'reboot_history') {
          // @ts-ignore
          SpinalGraphService._addNode(endpoint);
          var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(endpoint.getId().get());
          await timeseries.insert(requestBody.reboot, Date.now());
        } else if (endpoint.getName().get() === 'swap_history') {
          // @ts-ignore
          SpinalGraphService._addNode(endpoint);
          var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(endpoint.getId().get());
          await timeseries.insert(requestBody.swap, Date.now());
        } else if (endpoint.getName().get() === 'ram_history') {
          // @ts-ignore
          SpinalGraphService._addNode(endpoint);
          var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(endpoint.getId().get());
          await timeseries.insert(requestBody.ram, Date.now());
        } else if (endpoint.getName().get() === 'DD_history') {
          // @ts-ignore
          SpinalGraphService._addNode(endpoint);
          var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(endpoint.getId().get());
          await timeseries.insert(requestBody.DD, Date.now());
        } else if (endpoint.getName().get() === 'swap_history') {
          // @ts-ignore
          SpinalGraphService._addNode(endpoint);
          var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(endpoint.getId().get());
          await timeseries.insert(requestBody.swap, Date.now());
        } else if (endpoint.getName().get() === 'cache_history') {
          // @ts-ignore
          SpinalGraphService._addNode(endpoint);
          var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(endpoint.getId().get());
          await timeseries.insert(requestBody.cache, Date.now());
        } else if (endpoint.getName().get() === 'used_proc_history') {
          // @ts-ignore
          SpinalGraphService._addNode(endpoint);
          var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(endpoint.getId().get());
          await timeseries.insert(requestBody.used_proc, Date.now());
        }
        else if (endpoint.getName().get() === 'flux_history') {
          // @ts-ignore
          SpinalGraphService._addNode(endpoint);
          var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(endpoint.getId().get());
          await timeseries.insert(requestBody.flux, Date.now());
        }
      }
    }
    console.log(requestBody);
  }

}
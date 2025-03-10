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

import {
  MONITORING_SERVICE_ORGAN_RELATION_NAME,
  ORGAN_TYPE,
  PLATFORM_LIST,
  MONITORING_SERVICE_RELATION_TYPE_PTR_LST,
  MONITORING_SERVICE_PLATFORM_RELATION_NAME,
  CATEGORY_NAME,
  ORGAN_LIST,
  HUB_ORGAN_TYPE,
  ORGAN_GROUP,
} from '../constant';
import {
  SpinalGraphService,
  SpinalGraph,
} from 'spinal-env-viewer-graph-service';
import { OperationError } from '../utilities/operation-error';
import { HttpStatusCode } from '../utilities/http-status-code';
import {
  IOrganCreationParams,
  IOrganUpdateParams,
  IOrgan,
  IOrganHubCreationParams,
  IOrganHub,
} from './organ.model';
import SpinalMiddleware from '../spinalMiddleware';
import serviceDocumentation from 'spinal-env-viewer-plugin-documentation-service';
import spinalServiceTimeSeries from '../utilities/spinalTimeSeries';
import {
  InputDataEndpoint,
  InputDataEndpointDataType,
  InputDataEndpointType,
} from 'spinal-model-bmsnetwork';
import getInstance from '../utilities/NetworkService';
import { spinalControlPointService } from 'spinal-env-viewer-plugin-control-endpoint-service';
export class OrganService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }

  // public async createOrganGroupTree(): Promise<void> {
  //   const context = await this.graph.getContext(ORGAN_GROUP);
  //   const organtypologie
  // }

  public async createOrgan(
    organCreationParms: IOrganCreationParams
  ): Promise<IOrgan> {
    const oragnListContext = SpinalGraphService.getContext('organList');

    const organObject = {
      name: organCreationParms.name,
      type: ORGAN_TYPE,
      bosId: organCreationParms.bosId,
      organType: organCreationParms.organType,
      mac_adress: organCreationParms.mac_adress,
      ip_adress: organCreationParms.ip_adress,
      platformId: organCreationParms.platformId,
      status: '',
      [Symbol.iterator]: function* () {
        let properties = Object.keys(this);
        for (let i of properties) {
          yield [i, this[i]];
        }
      },
    };
    const OrganId = SpinalGraphService.createNode(organObject, undefined);
    var res = await SpinalGraphService.addChildInContext(
      oragnListContext.getId().get(),
      OrganId,
      oragnListContext.getId().get(),
      MONITORING_SERVICE_ORGAN_RELATION_NAME,
      MONITORING_SERVICE_RELATION_TYPE_PTR_LST
    );

    const category = await serviceDocumentation.addCategoryAttribute(
      res,
      CATEGORY_NAME
    );
    for (const [key, value] of organObject) {
      await serviceDocumentation.addAttributeByCategoryName(
        res,
        category.nameCat,
        key,
        value
      );
    }

    const rebootObj: InputDataEndpoint = {
      id: '0',
      name: 'reboot_history',
      path: '',
      currentValue: 0,
      unit: '',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Integer,
      type: InputDataEndpointType.Other,
    };

    const healthObj: InputDataEndpoint = {
      id: '0',
      name: 'health_history',
      path: '',
      currentValue: 0,
      unit: '',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Integer,
      type: InputDataEndpointType.Other,
    };

    const RamObj: InputDataEndpoint = {
      id: '0',
      name: 'ram_history',
      path: '',
      currentValue: 0,
      unit: 'Mo',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Integer,
      type: InputDataEndpointType.Other,
    };

    const Status: InputDataEndpoint = {
      id: '0',
      name: 'status',
      path: '',
      currentValue: 0,
      unit: '',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Integer,
      type: InputDataEndpointType.Other,
    };

    const LastPing: InputDataEndpoint = {
      id: '0',
      name: 'last_ping',
      path: '',
      currentValue: 0,
      unit: 'Timestamp',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Date,
      type: InputDataEndpointType.Other,
    };

    await getInstance().createNewBmsEndpointWithoutContext(OrganId, rebootObj);
    await getInstance().createNewBmsEndpointWithoutContext(OrganId, healthObj);
    await getInstance().createNewBmsEndpointWithoutContext(OrganId, RamObj);
    await getInstance().createNewBmsEndpointWithoutContext(OrganId, Status);
    await getInstance().createNewBmsEndpointWithoutContext(OrganId, LastPing);

    const platformListContext = SpinalGraphService.getContext('platformList');
    const platforms = await platformListContext.getChildren('HasPlatform');
    for (const platform of platforms) {
      if (platform.getId().get() === organCreationParms.platformId) {
        //@ts-ignore
        SpinalGraphService._addNode(platform);
        await SpinalGraphService.addChild(
          platform.getId().get(),
          OrganId,
          MONITORING_SERVICE_ORGAN_RELATION_NAME,
          MONITORING_SERVICE_RELATION_TYPE_PTR_LST
        );
      }
    }
    if (res !== undefined) {
      return {
        id: res.getId().get(),
        bosId: res.info.bosId.get(),
        name: res.getName().get(),
        type: res.getType().get(),
        mac_adress: res.info.mac_adress.get(),
        ip_adress: res.info.ip_adress.get(),
        organType: res.info.organType.get(),
        platformId: res.info.platformId.get(),
        status: res.info.status === undefined ? '' : res.info.status.get(),
      };
    }
  }

  public async createHubOrgan(
    organCreationParms: IOrganHubCreationParams,
    platformId: string
  ): Promise<IOrganHub> {
    const oragnListContext = SpinalGraphService.getContext(ORGAN_LIST);
    const organhubObject = {
      name: organCreationParms.name,
      type: ORGAN_TYPE,
      bosId: organCreationParms.bosId,
      mac_adress: organCreationParms.mac_adress,
      ip_adress: organCreationParms.ip_adress,
      url: organCreationParms.url,
      port: organCreationParms.port,
      login: organCreationParms.login,
      password: organCreationParms.password,
      organType: HUB_ORGAN_TYPE,
      platformId: platformId,
      status: '',
      [Symbol.iterator]: function* () {
        let properties = Object.keys(this);
        for (let i of properties) {
          yield [i, this[i]];
        }
      },
    };
    const OrganId = SpinalGraphService.createNode(organhubObject, undefined);
    var res = await SpinalGraphService.addChildInContext(
      oragnListContext.getId().get(),
      OrganId,
      oragnListContext.getId().get(),
      MONITORING_SERVICE_ORGAN_RELATION_NAME,
      MONITORING_SERVICE_RELATION_TYPE_PTR_LST
    );

    const category = await serviceDocumentation.addCategoryAttribute(
      res,
      CATEGORY_NAME
    );
    for (const [key, value] of organhubObject) {
      await serviceDocumentation.addAttributeByCategoryName(
        res,
        category.nameCat,
        key,
        value
      );
    }

    const rebootObj: InputDataEndpoint = {
      id: '0',
      name: 'reboot_history',
      path: '',
      currentValue: 0,
      unit: '',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Integer,
      type: InputDataEndpointType.Other,
    };

    const healthObj: InputDataEndpoint = {
      id: '0',
      name: 'health_history',
      path: '',
      currentValue: 0,
      unit: '',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Integer,
      type: InputDataEndpointType.Other,
    };

    const ramResObj: InputDataEndpoint = {
      id: '0',
      name: 'ram_res',
      path: '',
      currentValue: 0,
      unit: 'Mo',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Real,
      type: InputDataEndpointType.Other,
    };

    const ramVirtObj: InputDataEndpoint = {
      id: '0',
      name: 'ram_virt',
      path: '',
      currentValue: 0,
      unit: 'Mo',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Real,
      type: InputDataEndpointType.Other,
    };

    const countSessionsObj: InputDataEndpoint = {
      id: '0',
      name: 'count_session',
      path: '',
      currentValue: 0,
      unit: '',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Integer,
      type: InputDataEndpointType.Other,
    };

    const countUsersObj: InputDataEndpoint = {
      id: '0',
      name: 'count_users',
      path: '',
      currentValue: 0,
      unit: '',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Integer,
      type: InputDataEndpointType.Other,
    };
    const Status: InputDataEndpoint = {
      id: '0',
      name: 'status',
      path: '',
      currentValue: 0,
      unit: '',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Integer,
      type: InputDataEndpointType.Other,
    };

    const LastPing: InputDataEndpoint = {
      id: '0',
      name: 'last_ping',
      path: '',
      currentValue: 0,
      unit: 'Timestamp',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Date,
      type: InputDataEndpointType.Other,
    };

    await getInstance().createNewBmsEndpointWithoutContext(OrganId, rebootObj);
    await getInstance().createNewBmsEndpointWithoutContext(OrganId, healthObj);
    await getInstance().createNewBmsEndpointWithoutContext(OrganId, ramResObj);
    await getInstance().createNewBmsEndpointWithoutContext(OrganId, ramVirtObj);
    await getInstance().createNewBmsEndpointWithoutContext(
      OrganId,
      countSessionsObj
    );
    await getInstance().createNewBmsEndpointWithoutContext(
      OrganId,
      countUsersObj
    );
    await getInstance().createNewBmsEndpointWithoutContext(OrganId, Status);
    await getInstance().createNewBmsEndpointWithoutContext(OrganId, LastPing);

    const platformListContext = SpinalGraphService.getContext('platformList');
    const platforms = await platformListContext.getChildren('HasPlatform');
    for (const platform of platforms) {
      if (platform.getId().get() === platformId) {
        //@ts-ignore
        SpinalGraphService._addNode(platform);
        await SpinalGraphService.addChild(
          platform.getId().get(),
          OrganId,
          MONITORING_SERVICE_ORGAN_RELATION_NAME,
          MONITORING_SERVICE_RELATION_TYPE_PTR_LST
        );
      }
    }
    if (res !== undefined) {
      return {
        id: res.getId().get(),
        bosId: res.info.bosId.get(),
        name: res.getName().get(),
        type: res.getType().get(),
        mac_adress: res.info.get(),
        ip_adress:
          res.info.ip_adress !== undefined ? res.info.ip_adress.get() : '',
        URL: res.info.url.get(),
        port: res.info.port.get(),
        login: res.info.login.get(),
        password: res.info.password.get(),
        organType: res.info.organType.get(),
        platformId: res.info.platformId.get(),
        status: res.info.status === undefined ? '' : res.info.status.get(),
      };
    }
  }

  public async getOrganHealth(organId: string, begin: number, end: number) {
    try {
      const context = SpinalGraphService.getContext('organList');
      const organs = await context.getChildren(
        MONITORING_SERVICE_ORGAN_RELATION_NAME
      );
      for (const organ of organs) {
        if (organ.getId().get() === organId) {
          const endpoints = await organ.getChildren('hasBmsEndpoint');
          for (const endpoint of endpoints) {
            if (endpoint.getName().get() === 'health_history') {
              // @ts-ignore
              SpinalGraphService._addNode(endpoint);
              const timeSeriesIntervalDate = {
                start: begin,
                end: end,
              };
              const timeseries = await spinalServiceTimeSeries().getData(
                endpoint.getId().get(),
                timeSeriesIntervalDate
              );
              return timeseries;
            }
          }
        }
      }
    } catch (error) {
      return error;
    }
  }

  public async getOrganReboot(organId: string, begin: number, end: number) {
    try {
      const context = SpinalGraphService.getContext('organList');
      const organs = await context.getChildren(
        MONITORING_SERVICE_ORGAN_RELATION_NAME
      );
      for (const organ of organs) {
        if (organ.getId().get() === organId) {
          const endpoints = await organ.getChildren('hasBmsEndpoint');
          for (const endpoint of endpoints) {
            if (endpoint.getName().get() === 'reboot_history') {
              // @ts-ignore
              SpinalGraphService._addNode(endpoint);
              const timeSeriesIntervalDate = {
                start: begin,
                end: end,
              };
              const timeseries = await spinalServiceTimeSeries().getData(
                endpoint.getId().get(),
                timeSeriesIntervalDate
              );
              return timeseries;
            }
          }
        }
      }
    } catch (error) {
      return error;
    }
  }

  public async getOrganStatus(organId: string, begin: number, end: number) {
    try {
      const context = SpinalGraphService.getContext('organList');
      const organs = await context.getChildren(
        MONITORING_SERVICE_ORGAN_RELATION_NAME
      );
      for (const organ of organs) {
        if (organ.getId().get() === organId) {
          const endpoints = await organ.getChildren('hasBmsEndpoint');
          for (const endpoint of endpoints) {
            if (endpoint.getName().get() === 'status') {
              // @ts-ignore
              SpinalGraphService._addNode(endpoint);
              const timeSeriesIntervalDate = {
                start: begin,
                end: end,
              };
              const timeseries = await spinalServiceTimeSeries().getData(
                endpoint.getId().get(),
                timeSeriesIntervalDate
              );
              return timeseries;
            }
          }
        }
      }
    } catch (error) {
      return error;
    }
  }


  public async getOrganRam(organId: string, begin: number, end: number) {
    try {
      const context = SpinalGraphService.getContext('organList');
      const organs = await context.getChildren(
        MONITORING_SERVICE_ORGAN_RELATION_NAME
      );
      for (const organ of organs) {
        if (organ.getId().get() === organId) {
            organ.get
          const endpoints = await organ.getChildren('hasBmsEndpoint');
          for (const endpoint of endpoints) {
            //if organ is a hub , return ram_res , else return ram_history
            if ( ['ram_history','ram_res'].includes(endpoint.getName().get())) {
              // @ts-ignore
              SpinalGraphService._addNode(endpoint);
              const timeSeriesIntervalDate = {
                start: begin,
                end: end,
              };
              const timeseries = await spinalServiceTimeSeries().getData(
                endpoint.getId().get(),
                timeSeriesIntervalDate
              );
              return timeseries;
            }
          }
        }
      }
    } catch (error) {
      return error;
    }
  }





  public async getOrgans(): Promise<IOrgan[]> {
    try {
      var organsObjectList = [];
      const context = SpinalGraphService.getContext('organList');
      const organs = await context.getChildren(
        MONITORING_SERVICE_ORGAN_RELATION_NAME
      );
      for (const organ of organs) {
        let organObject: any = {};
        const attrs = await serviceDocumentation.getAttributesByCategory(
          organ,
          CATEGORY_NAME
        );
        for (const attr of attrs) {
          if (attr.label.get() === 'id')
            Object.assign(organObject, { id: attr.value.get() });
          else if (attr.label.get() === 'bosId')
            Object.assign(organObject, { bosId: attr.value.get() });
          else if (attr.label.get() === 'name')
            Object.assign(organObject, { name: attr.value.get() });
          else if (attr.label.get() === 'type')
            Object.assign(organObject, { type: attr.value.get() });
          else if (attr.label.get() === 'mac_adress')
            Object.assign(organObject, { mac_adress: attr.value.get() });
          else if (attr.label.get() === 'ip_adress')
            Object.assign(organObject, { ip_adress: attr.value.get() });
          else if (attr.label.get() === 'url')
            Object.assign(organObject, { url: attr.value.get() });
          else if (attr.label.get() === 'port')
            Object.assign(organObject, { port: attr.value.get() });
          else if (attr.label.get() === 'login')
            Object.assign(organObject, { login: attr.value.get() });
          else if (attr.label.get() === 'password')
            Object.assign(organObject, { password: attr.value.get() });
          else if (attr.label.get() === 'organType')
            Object.assign(organObject, { organType: attr.value.get() });
          else if (attr.label.get() === 'platformId')
            Object.assign(organObject, { platformId: attr.value.get() });
        }
        const endpoints = await organ.getChildren('hasBmsEndpoint');
        const status = endpoints.find((endpoint) => {
          return endpoint.getName().get() === 'status';
        });
        if (status) {
          const element = await status.element.load();
          const value = await element.currentValue.get();
          Object.assign(organObject, { status: value });
        }

        const lastHealthTime = endpoints.find((endpoint) => {
          return endpoint.getName().get() === 'last_ping';
        });
        if (lastHealthTime) {
          const element = await lastHealthTime.element.load();
          Object.assign(organObject, {
            lastHealth: element?.currentValue?.get(),
          });
        }
        organsObjectList.push(organObject);
      }
      return organsObjectList;
    } catch (error) {
      return error;
    }
  }

  public async getOrgan(organId: string): Promise<IOrgan> {
    try {
      const context = SpinalGraphService.getContext('organList');
      const organs = await context.getChildren(
        MONITORING_SERVICE_ORGAN_RELATION_NAME
      );
      for (const organ of organs) {
        if (organ.getId().get() === organId) {
          var organObject: any = {};
          const attrs = await serviceDocumentation.getAttributesByCategory(
            organ,
            CATEGORY_NAME
          );
          for (const attr of attrs) {
            if (attr.label.get() === 'id')
              Object.assign(organObject, { id: attr.value.get() });
            else if (attr.label.get() === 'bosId')
              Object.assign(organObject, { bosId: attr.value.get() });
            else if (attr.label.get() === 'name')
              Object.assign(organObject, { name: attr.value.get() });
            else if (attr.label.get() === 'type')
              Object.assign(organObject, { type: attr.value.get() });
            else if (attr.label.get() === 'mac_adress')
              Object.assign(organObject, { mac_adress: attr.value.get() });
            else if (attr.label.get() === 'ip_adress')
              Object.assign(organObject, { ip_adress: attr.value.get() });
            else if (attr.label.get() === 'url')
              Object.assign(organObject, { url: attr.value.get() });
            else if (attr.label.get() === 'port')
              Object.assign(organObject, { port: attr.value.get() });
            else if (attr.label.get() === 'login')
              Object.assign(organObject, { login: attr.value.get() });
            else if (attr.label.get() === 'password')
              Object.assign(organObject, { password: attr.value.get() });
            else if (attr.label.get() === 'organType')
              Object.assign(organObject, { organType: attr.value.get() });
            else if (attr.label.get() === 'platformId')
              Object.assign(organObject, { platformId: attr.value.get() });
            const endpoints = await organ.getChildren('hasBmsEndpoint');
            const status = endpoints.find((endpoint) => {
              return endpoint.getName().get() === 'status';
            });
            if (status) {
              const element = await status.element.load();
              const value = await element?.currentValue?.get();
              Object.assign(organObject, { status: value });
            }

            const lastHealthTime = endpoints.find((endpoint) => {
              return endpoint.getName().get() === 'last_ping';
            });
            if (lastHealthTime) {
              const element = await lastHealthTime.element.load();
              Object.assign(organObject, {
                lastHealth: element?.currentValue?.get(),
              });
            }
          }
        }
      }
      if (organObject) return organObject;
      else throw new OperationError('NOT_FOUND', HttpStatusCode.FORBIDDEN);
    } catch (error) {
      return error;
    }
  }

  public async updateOrgan(
    organId: string,
    requestBody: IOrganUpdateParams
  ): Promise<IOrgan> {
    const context = SpinalGraphService.getContext('organList');
    const organs = await context.getChildren(
      MONITORING_SERVICE_ORGAN_RELATION_NAME
    );
    for (const organ of organs) {
      if (organ.getId().get() === organId) {
        const attrs = await serviceDocumentation.getAttributesByCategory(
          organ,
          CATEGORY_NAME
        );
        for (const attr of attrs) {
          if (attr.label.get() === 'name')
            serviceDocumentation.setAttributeById(
              organ,
              attr._server_id,
              'name',
              requestBody.name,
              attr.type.get(),
              attr.unit.get()
            );
          else if (attr.label.get() === 'organType')
            serviceDocumentation.setAttributeById(
              organ,
              attr._server_id,
              'organType',
              requestBody.organType,
              attr.type.get(),
              attr.unit.get()
            );
          else if (attr.label.get() === 'mac_adress')
            serviceDocumentation.setAttributeById(
              organ,
              attr._server_id,
              'mac_adress',
              requestBody.mac_adress,
              attr.type.get(),
              attr.unit.get()
            );
          else if (attr.label.get() === 'ip_adress')
            serviceDocumentation.setAttributeById(
              organ,
              attr._server_id,
              'ip_adress',
              requestBody.ip_adress,
              attr.type.get(),
              attr.unit.get()
            );

          const attrsres = await serviceDocumentation.getAttributesByCategory(
            organ,
            CATEGORY_NAME
          );
          var organObject: any = {};
          for (const attr of attrsres) {
            if (attr.label.get() === 'id')
              Object.assign(organObject, { id: attr.value.get() });
            else if (attr.label.get() === 'bosId')
              Object.assign(organObject, { bosId: attr.value.get() });
            else if (attr.label.get() === 'name')
              Object.assign(organObject, { name: attr.value.get() });
            else if (attr.label.get() === 'type')
              Object.assign(organObject, { type: attr.value.get() });
            else if (attr.label.get() === 'mac_adress')
              Object.assign(organObject, { mac_adress: attr.value.get() });
            else if (attr.label.get() === 'ip_adress')
              Object.assign(organObject, { ip_adress: attr.value.get() });
            else if (attr.label.get() === 'organType')
              Object.assign(organObject, { organType: attr.value.get() });
            else if (attr.label.get() === 'platformId')
              Object.assign(organObject, { platformId: attr.value.get() });
            else if (attr.label.get() === 'status')
              Object.assign(organObject, { status: attr.value.get() });
          }
        }
      }
      if (organObject !== undefined) return organObject;
      else throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
    }
  }

  public async deleteOrgan(organId: string): Promise<void> {
    const organListContext = SpinalGraphService.getContext('organList');
    const organs = await organListContext.getChildren(
      MONITORING_SERVICE_ORGAN_RELATION_NAME
    );
    for (const organ of organs) {
      if (organ.getId().get() === organId) {
        await organ.removeFromGraph();
      }
    }
  }
}

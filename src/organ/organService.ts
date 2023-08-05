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
  CATEGORY_NAME
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
  StatusOrgan
} from './organ.model';
import SpinalMiddleware from '../spinalMiddleware';
import serviceDocumentation from "spinal-env-viewer-plugin-documentation-service"
import { InputDataEndpoint, InputDataEndpointDataType, InputDataEndpointType } from 'spinal-model-bmsnetwork';
import getInstance from '../utilities/NetworkService';


export class OrganService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }
  public async createOrgan(
    organCreationParms: IOrganCreationParams
  ): Promise<IOrgan> {
    const oragnListContext = SpinalGraphService.getContext('organList');
    const organObject = {
      name: organCreationParms.name,
      type: ORGAN_TYPE,
      bosId: organCreationParms.bosId,
      organType: organCreationParms.organType,
      bootTimestamp: organCreationParms.bootTimestamp,
      lastHealthTime: organCreationParms.lastHealthTime,
      platformId: organCreationParms.platformId,
      [Symbol.iterator]: function* () {
        let properties = Object.keys(this);
        for (let i of properties) {
          yield [i, this[i]];
        }
      }
    };
    const OrganId = SpinalGraphService.createNode(organObject, undefined);
    var res = await SpinalGraphService.addChildInContext(
      oragnListContext.getId().get(),
      OrganId,
      oragnListContext.getId().get(),
      MONITORING_SERVICE_ORGAN_RELATION_NAME,
      MONITORING_SERVICE_RELATION_TYPE_PTR_LST
    );

    const category = await serviceDocumentation.addCategoryAttribute(res, CATEGORY_NAME)
    for (const [key, value] of organObject) {
      await serviceDocumentation.addAttributeByCategoryName(res, category.nameCat, key, value)
    }

    const rebootObj: InputDataEndpoint = {
      id: "0",
      name: "reboot_history",
      path: "",
      currentValue: organCreationParms.bootTimestamp,
      unit: 'timestamp',
      nodeTypeName: 'BmsEndpoint',
      dataType: InputDataEndpointDataType.Date,
      type: InputDataEndpointType.Other,
    };
    const healthObj: InputDataEndpoint = {
      id: "0",
      name: "health_history",
      path: "",
      currentValue: organCreationParms.lastHealthTime,
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

    await getInstance().createNewBmsEndpointWithoutContext(OrganId, rebootObj);
    await getInstance().createNewBmsEndpointWithoutContext(OrganId, healthObj);
    await getInstance().createNewBmsEndpointWithoutContext(OrganId, RamObj);


    const platformListContext = SpinalGraphService.getContext('platformList');
    const platforms = await platformListContext.getChildren('HasPlatform');
    for (const platform of platforms) {
      if (platform.getId().get() === organCreationParms.platformId) {
        //@ts-ignore
        SpinalGraphService._addNode(platform);
        await SpinalGraphService.addChild(platform.getId().get(),
          OrganId, MONITORING_SERVICE_ORGAN_RELATION_NAME,
          MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
      }
    }
    if (res !== undefined) {
      return {
        id: res.getId().get(),
        bosId: res.info.bosId.get(),
        name: res.getName().get(),
        type: res.getType().get(),
        bootTimestamp: res.info.bootTimestamp.get(),
        lastHealthTime: res.info.lastHealthTime.get(),
        organType: res.info.organType.get(),
        platformId: res.info.platformId.get(),
      };
    }
  }

  // public async getOrgans(): Promise<IOrgan[]> {
  //   try {
  //     var organsObjectList = [];
  //     const context = SpinalGraphService.getContext('organList')
  //     const organs = await context.getChildren(
  //       MONITORING_SERVICE_ORGAN_RELATION_NAME
  //     );
  //     for (const organ of organs) {
  //       var OrganObject: IOrgan = {
  //         id: organ.getId().get(),
  //         bootTimestamp: organ.info.bootTimestamp.get(),
  //         type: organ.getType().get(),
  //         name: organ.getName().get(),
  //         bosId: organ.info.bosId?.get(),
  //         lastHealthTime: organ.info.lastHealthTime.get(),
  //         ramHeapUsed: organ.info.ramHeapUsed.get(),
  //         statusOrgan: organ.info.statusOrgan.get(),
  //         organType: organ.info.organType.get(),
  //         platformId: organ.info.platformId.get(),
  //         ipAdress: organ.info.ipAdress.get(),
  //         port: organ.info.port.get(),
  //         protocol: organ.info.protocol.get(),
  //       };
  //       organsObjectList.push(OrganObject);
  //     }

  //     return organsObjectList;
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // public async getOrgan(organId: string): Promise<IOrgan> {
  //   try {
  //     const context = SpinalGraphService.getContext('organList')
  //     const organs = await context.getChildren(
  //       MONITORING_SERVICE_ORGAN_RELATION_NAME
  //     );
  //     for (const organ of organs) {
  //       if (organ.getId().get() === organId) {
  //         var OrganObject: IOrgan = {
  //           id: organ.getId().get(),
  //           bosId: organ.info.bosId.get(),
  //           type: organ.getType().get(),
  //           name: organ.getName().get(),
  //           bootTimestamp: organ.info.bootTimestamp.get(),
  //           lastHealthTime: organ.info.lastHealthTime.get(),
  //           ramHeapUsed: organ.info.ramHeapUsed.get(),
  //           statusOrgan: organ.info.statusOrgan.get(),
  //           organType: organ.info.organType.get(),
  //           platformId: organ.info.platformId.get(),
  //           ipAdress: organ.info.ipAdress.get(),
  //           port: organ.info.port.get(),
  //           protocol: organ.info.protocol.get(),
  //         };
  //       }
  //     }
  //     return OrganObject;
  //   } catch (error) {
  //     return error;
  //   }
  // }

  // public async updateOrgan(
  //   organId: string,
  //   requestBody: IOrganUpdateParams
  // ): Promise<IOrgan> {

  //   const context = SpinalGraphService.getContext('organList')
  //   const organs = await context.getChildren(
  //     MONITORING_SERVICE_ORGAN_RELATION_NAME
  //   ); for (const organ of organs) {
  //     if (organ.getId().get() === organId) {
  //       if (requestBody.name !== undefined) organ.info.name.set(requestBody.name)
  //       if (requestBody.statusOrgan !== undefined) organ.info.statusOrgan.set(requestBody.statusOrgan)
  //       if (requestBody.organType !== undefined) organ.info.organType.set(requestBody.organType)

  //       var OrganObject: IOrgan = {
  //         id: organ.getId().get(),
  //         bosId: organ.info.bosId.get(),
  //         type: organ.getType().get(),
  //         name: organ.getName().get(),
  //         bootTimestamp: organ.info.bootTimestamp.get(),
  //         lastHealthTime: organ.info.lastHealthTime.get(),
  //         ramHeapUsed: organ.info.ramHeapUsed.get(),
  //         statusOrgan: organ.info.statusOrgan.get(),
  //         organType: organ.info.organType.get(),
  //         platformId: organ.info.platformId.get(),
  //         ipAdress: organ.info.ipAdress.get(),
  //         port: organ.info.port.get(),
  //         protocol: organ.info.protocol.get(),
  //       };
  //     }
  //   }

  //   if (OrganObject !== undefined) return OrganObject;
  //   else throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
  // }

  public async deleteOrgan(organId: string): Promise<void> {
    const organListContext = SpinalGraphService.getContext('organList');
    const organs = await organListContext.getChildren(
      MONITORING_SERVICE_ORGAN_RELATION_NAME
    );
    for (const organ of organs) {
      if (organ.getId().get() === organId) {
        await organ.removeFromGraph()
      }
    }
  }

}

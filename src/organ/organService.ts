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
    const organObject: IOrganCreationParams = {
      name: organCreationParms.name,
      type: ORGAN_TYPE,
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
    const OrganId = SpinalGraphService.createNode(organObject, undefined);
    var res = await SpinalGraphService.addChildInContext(
      oragnListContext.getId().get(),
      OrganId,
      oragnListContext.getId().get(),
      MONITORING_SERVICE_ORGAN_RELATION_NAME,
      MONITORING_SERVICE_RELATION_TYPE_PTR_LST
    );
    const platformListContext = SpinalGraphService.getContext('platformList');
    const platforms = await platformListContext.getChildren('HasPlatform');
    for (const platform of platforms) {
      if (platform.getId().get() === organCreationParms.platformId) {
        //@ts-ignore
        SpinalGraphService._addNode(platform);
        await SpinalGraphService.addChild(platform.getId().get(), OrganId, MONITORING_SERVICE_ORGAN_RELATION_NAME,
          MONITORING_SERVICE_RELATION_TYPE_PTR_LST)
        var res = await SpinalGraphService.addChildInContext(
          platform.getId().get(),
          OrganId,
          oragnListContext.getId().get(),
          MONITORING_SERVICE_ORGAN_RELATION_NAME,
          MONITORING_SERVICE_RELATION_TYPE_PTR_LST
        );
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
  }

  public async getOrgans(): Promise<IOrgan[]> {
    try {
      var organsObjectList = [];
      const context = SpinalGraphService.getContext('organList')
      const organs = await context.getChildren(
        MONITORING_SERVICE_ORGAN_RELATION_NAME
      );
      for (const organ of organs) {
        var OrganObject: IOrgan = {
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
    } catch (error) {
      return error;
    }
  }

  public async getOrgan(organId: string): Promise<IOrgan> {
    try {
      const context = SpinalGraphService.getContext('organList')
      const organs = await context.getChildren(
        MONITORING_SERVICE_ORGAN_RELATION_NAME
      );
      for (const organ of organs) {
        if (organ.getId().get() === organId) {
          var OrganObject: IOrgan = {
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
        }
      }
      return OrganObject;
    } catch (error) {
      return error;
    }
  }

  public async updateOrgan(
    organId: string,
    requestBody: IOrganUpdateParams
  ): Promise<IOrgan> {

    const context = SpinalGraphService.getContext('organList')
    const organs = await context.getChildren(
      MONITORING_SERVICE_ORGAN_RELATION_NAME
    ); for (const organ of organs) {
      if (organ.getId().get() === organId) {
        if (requestBody.name !== undefined) organ.info.name.set(requestBody.name)
        if (requestBody.bootTimestamp !== undefined) organ.info.bootTimestamp.set(requestBody.bootTimestamp)
        if (requestBody.lastHealthTime !== undefined) organ.info.lastHealthTime.set(requestBody.lastHealthTime)
        if (requestBody.ramHeapUsed !== undefined) organ.info.ramHeapUsed.set(requestBody.ramHeapUsed)
        if (requestBody.statusOrgan !== undefined) organ.info.statusOrgan.set(requestBody.statusOrgan)
        if (requestBody.organType !== undefined) organ.info.organType.set(requestBody.organType)
        if (requestBody.ipAdress !== undefined) organ.info.ipAdress.set(requestBody.ipAdress)
        if (requestBody.port !== undefined) organ.info.port.set(requestBody.port)
        if (requestBody.protocol !== undefined) organ.info.protocol.set(requestBody.protocol)
        if (requestBody.platformId !== undefined) organ.info.platformId.set(requestBody.platformId)

        var OrganObject: IOrgan = {
          id: organ.getId().get(),
          type: organ.getType().get(),
          name: organ.getName().get(),
          statusOrgan: organ.info.statusOrgan.get(),
          bootTimestamp: organ.info.bootTimestamp.get(),
          lastHealthTime: organ.info.lastHealthTime.get(),
          ramHeapUsed: organ.info.ramHeapUsed.get(),
          organType: organ.info.organType.get(),
          platformId: organ.info.platformId.get(),
        };
      }
    }

    if (OrganObject !== undefined) return OrganObject;
    else throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
  }

  public async deleteOrgan(organId: string): Promise<void> {
    const organListContext = SpinalGraphService.getContext('organList');
    const organs = await organListContext.getChildren(
      MONITORING_SERVICE_ORGAN_RELATION_NAME
    );
    for (const organ of organs) {
      if (organ.getId().get() === organId) {
        SpinalGraphService.removeFromGraph(organ.getId().get());
      }
    }
  }
}

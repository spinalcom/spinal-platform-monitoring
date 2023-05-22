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
    const platformContext = SpinalGraphService.getContext('platformList');
    const organObject: IOrganCreationParams = {
      name: organCreationParms.name,
      type: ORGAN_TYPE,
      organType: organCreationParms.organType,
      statusOrgan: '',
      platformId: organCreationParms.platformId,
    };
    const OrganId = SpinalGraphService.createNode(organObject, undefined);
    const platforms = await platformContext.getChildren('HasPlatform');
    for (const platform of platforms) {
      if (platform.getId().get() === organCreationParms.platformId) {
        //@ts-ignore
        SpinalGraphService._addNode(platform);
        var res = await SpinalGraphService.addChildInContext(
          platform.getId().get(),
          OrganId,
          platformContext.getId().get(),
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
        organType: res.info.organType.get(),
        platformId: res.info.platformId.get(),
      };
    }
  }

  public async getOrgans(platformId: string): Promise<IOrgan[]> {
    try {
      var organsObjectList = [];
      const contexts = await this.graph.getChildren('hasContext');
      for (const context of contexts) {
        if (context.getName().get() === PLATFORM_LIST) {
          const platforms = await context.getChildren(
            MONITORING_SERVICE_PLATFORM_RELATION_NAME
          );
          for (const platform of platforms) {
            if (platform.getId().get() === platformId) {
              var organs = await platform.getChildren('HasOrgan');
              for (const organ of organs) {
                var OrganObject: IOrgan = {
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
    } catch (error) {
      return error;
    }
  }

  public async getOrgan(platformId: string, organId: string): Promise<IOrgan> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          MONITORING_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === platformId) {
            var organs = await platform.getChildren('HasOrgan');
            for (const organ of organs) {
              if (organ.getId().get() === organId) {
                var OrganObject: IOrgan = {
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
        } else {
          throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
        }
      }
    }
  }

  public async updateOrgan(
    organId: string,
    requestBody: IOrganUpdateParams
  ): Promise<IOrgan> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          MONITORING_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === requestBody.platformId) {
            var organs = await platform.getChildren('HasOrgan');
            for (const organ of organs) {
              if (organ.getId().get() === organId) {
                organ.info.name.set(requestBody.name);
                organ.info.organType.set(requestBody.organType);
                organ.info.statusOrgan.set(requestBody.statusOrgan);

                var OrganObject: IOrgan = {
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
    if (OrganObject !== undefined) return OrganObject;
    else throw new OperationError('NOT_FOUND', HttpStatusCode.NOT_FOUND);
  }

  public async deleteOrgan(platformId: string, organId: string): Promise<void> {
    const contexts = await this.graph.getChildren('hasContext');
    for (const context of contexts) {
      if (context.getName().get() === PLATFORM_LIST) {
        const platforms = await context.getChildren(
          MONITORING_SERVICE_PLATFORM_RELATION_NAME
        );
        for (const platform of platforms) {
          if (platform.getId().get() === platformId) {
            var organs = await platform.getChildren('HasOrgan');
            for (const organ of organs) {
              if (organ.getId().get() === organId) {
                SpinalGraphService.removeFromGraph(organ.getId().get());
              }
            }
          }
        }
      }
    }
  }
}

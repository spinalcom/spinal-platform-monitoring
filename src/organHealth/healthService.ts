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

import { IHealth, IHealthCreationParams } from "./health.model";
import SpinalMiddleware from '../spinalMiddleware';
import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
export class HealthService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  // public logService: LogsService;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }

  public async createHealth(requestBody: any): Promise<any> {
    const contextPlatform = await SpinalGraphService.getContext('platformList');
    const platforms = await contextPlatform.getChildren('HasPlatform')

    for (const platform of platforms) {
      if (platform.info.TokenBosRegister.get() === requestBody.TokenBosRegister) {
        const organs = await platform.getChildren('HasOrgan');
        for (const organ of organs) {
          for (const infoOrgan of requestBody.infoOrgans) {
            if (organ.info.bosId.get() === infoOrgan.genericOrganData.id) {

              let state: string = "";
              if (isWithinTwoMinutes(infoOrgan.genericOrganData.lastHealthTime)) {
                state = "online"
              } else {
                state = "stop"
              }
              // organ.info.bootTimestamp.set(infoOrgan.genericOrganData.bootTimestamp);
              // organ.info.lastHealthTime.set(infoOrgan.genericOrganData.lastHealthTime);
              // organ.info.ramHeapUsed.set(infoOrgan.genericOrganData.ramHeapUsed);
              organ.info.statusOrgan.set(state);
              organ.info.ipAdress.set(infoOrgan.specificOrganData.ipAdress);
              organ.info.port.set(infoOrgan.specificOrganData.port);
              organ.info.protocol.set(infoOrgan.specificOrganData.protocol);
            }
          }
        }
      }
    }
    return requestBody;
  }
}


function isWithinTwoMinutes(timestamp: number) {
  var twoMinutesAgo = Date.now() - (2 * 60 * 1000); // calculate timestamp for 2 minutes ago
  return (timestamp >= twoMinutesAgo && timestamp <= Date.now()); // check if timestamp is within 2 minutes
}
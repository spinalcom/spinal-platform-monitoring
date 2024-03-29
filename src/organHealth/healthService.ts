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
  CATEGORY_NAME
} from '../constant';
import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import { InputDataEndpoint, InputDataEndpointDataType, InputDataEndpointType } from 'spinal-model-bmsnetwork';
import getInstance from '../utilities/NetworkService';
import spinalServiceTimeSeries from '../utilities/spinalTimeSeries';
import { OrganService } from '../organ/organService'
import {
  IOrganCreationParams,
  IOrganUpdateParams,
  IOrgan,
  IOrganHubCreationParams,
  IOrganHub,
} from '../organ/organ.model';
import serviceDocumentation from "spinal-env-viewer-plugin-documentation-service"



export class HealthService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  public organService: OrganService;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
    this.organService = new OrganService();
  }

  public async createHealth(requestBody: any): Promise<any> {
    const contextPlatform = await SpinalGraphService.getContext('platformList');
    const platforms = await contextPlatform.getChildren('HasPlatform')
    for (const platform of platforms) {
      const attrs = await serviceDocumentation.getAttributesByCategory(platform, CATEGORY_NAME);
      let TokenBosRegister: string | boolean | number;
      for (const attr of attrs) {
        if (attr.label.get() === 'TokenBosRegister') TokenBosRegister = attr.value.get()
      }
      if (TokenBosRegister === requestBody.TokenBosRegister) {
        const organs = await platform.getChildren('HasOrgan');
        let newOrgans = compareTabs(requestBody.infoOrgans, organs)
        if (newOrgans) {
          for (const newOrgan of newOrgans) {
            const objCreationOrgan: IOrganCreationParams = {
              bosId: newOrgan.genericOrganData.id,
              name: newOrgan.genericOrganData.name,
              type: "",
              mac_adress: newOrgan.genericOrganData.macAdress,
              ip_adress: newOrgan.genericOrganData.serverName,
              organType: newOrgan.genericOrganData.type,
              platformId: platform.getId().get(),
            }
            console.log(objCreationOrgan);

            // let res = await new OrganService().createOrgan(objCreationOrgan);
            // console.log("=====", res);
          }
        }
        for (const organ of organs) {
          for (const infoOrgan of requestBody.infoOrgans) {
            if (organ.info.name.get() === infoOrgan.genericOrganData.name) {
              var state: string = "";
              if (isWithinTwoMinutes(infoOrgan.genericOrganData.lastHealthTime)) {
                state = "online"
              } else {
                state = "stop"
              }
              const endpoints = await organ.getChildren('hasBmsEndpoint')
              for (const endpoint of endpoints) {
                if (endpoint.getName().get() === 'health_history') {
                  // @ts-ignore
                  SpinalGraphService._addNode(endpoint);
                  var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(endpoint.getId().get());
                  await timeseries.insert(infoOrgan.genericOrganData.lastHealthTime, Date.now());
                } else if (endpoint.getName().get() === 'reboot_history') {
                  // @ts-ignore
                  SpinalGraphService._addNode(endpoint);
                  var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(endpoint.getId().get());
                  await timeseries.insert(infoOrgan.genericOrganData.bootTimestamp, Date.now());
                } else if (endpoint.getName().get() === 'ram_history') {
                  // @ts-ignore
                  SpinalGraphService._addNode(endpoint);
                  const chaine = infoOrgan.genericOrganData.ramRssUsed;
                  const regex = /([\d.]+)\s*MB/;
                  const match = chaine.match(regex);
                  if (match) {
                    const resRegex = parseFloat(match[1]);
                    var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(endpoint.getId().get());
                    await timeseries.insert(resRegex, Date.now());
                  }
                }
              }
              const attrs = await serviceDocumentation.getAttributesByCategory(organ, CATEGORY_NAME);
              for (const attr of attrs) {
                if (attr.label.get() === 'mac_adress') serviceDocumentation.setAttributeById(organ, attr._server_id, 'mac_adress', infoOrgan.genericOrganData.macAdress, attr.type.get(), attr.unit.get())
              }
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

function compareTabs(organMonit, organBos: SpinalNode[]) {
  let resultat = [];
  organMonit.forEach(requestObj => {
    let estPresent = organBos.some(organNode => {
      // Comparaison des objets (à ajuster selon les besoins)
      return JSON.stringify(requestObj.genericOrganData.name) === organNode.getName().get();
    });

    if (!estPresent) {
      resultat.push(requestObj);
    }
  });
  return resultat;
}


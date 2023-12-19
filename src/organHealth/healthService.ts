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

import { IHealth, IHealthCreationParams } from './health.model';
import SpinalMiddleware from '../spinalMiddleware';

import { CATEGORY_NAME, HUB_ORGAN_TYPE } from '../constant';
import {
  SpinalGraphService,
  SpinalGraph,
  SpinalContext,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import {
  InputDataEndpoint,
  InputDataEndpointDataType,
  InputDataEndpointType,
} from 'spinal-model-bmsnetwork';
import getInstance from '../utilities/NetworkService';
import spinalServiceTimeSeries from '../utilities/spinalTimeSeries';
import { OrganService } from '../organ/organService';
import { IOrganCreationParams, IOrganHubCreationParams } from '../organ/organ.model';
import serviceDocumentation from 'spinal-env-viewer-plugin-documentation-service';

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
    const platforms = await contextPlatform.getChildren('HasPlatform');

    for (const platform of platforms) {
      const attrs = await serviceDocumentation.getAttributesByCategory(
        platform,
        CATEGORY_NAME
      );
      let TokenBosRegister: string | boolean | number;
      for (const attr of attrs) {
        if (attr.label.get() === 'TokenBosRegister')
          TokenBosRegister = attr.value.get();
      }
      // find the platform with the same registery token as the one in api call

      if (TokenBosRegister === requestBody.TokenBosRegister) {
        const organs = await platform.getChildren('HasOrgan');

        // Creating / Updating organs
        for (const infoOrgan of requestBody.infoOrgans) {
          let organNode = organs.find(
            (organ) => organ.info.name.get() === infoOrgan.genericOrganData.name
          );
          if (!organNode) {
            const organCreationParms: IOrganCreationParams = {
              bosId: '',
              name: infoOrgan.genericOrganData.name,
              type: '',
              mac_adress: infoOrgan.genericOrganData.macAdress,
              ip_adress: infoOrgan.genericOrganData.idAdress,
              organType: infoOrgan.genericOrganData.type,
              platformId: platform.getId().get(),
            };

            const organNodeInfo = await this.organService.createOrgan(
              organCreationParms
            );
            console.log(
              'Created unknown organ : ',
              infoOrgan.genericOrganData.name
            );
            organNode = SpinalGraphService.getRealNode(organNodeInfo.id);
          }
          console.log('Updating endpoints of ', organNode.info.name.get());
          await updateOrganEndpoints(organNode, infoOrgan);
          organNode.info.mac_adress.set(infoOrgan.specificOrganData.mac_adress);
        }
        // Updating Hub Organ
        let hubOrganNode = organs.find(
          (organ) => organ.info.organType.get() === HUB_ORGAN_TYPE
        );
        if(!hubOrganNode){
          const hubOrganHub : IOrganHubCreationParams = {
            bosId: '',
            name: 'Hub',
            url :'',
            port: 0,
            login: '',
            password: '',
            mac_adress: '',
            ip_adress: '',
            organType: HUB_ORGAN_TYPE,
            platformId: platform.getId().get(),
          } 
          const organHubInfo = await this.organService.createHubOrgan(hubOrganHub,platform.getId().get());
          hubOrganNode = SpinalGraphService.getRealNode(organHubInfo.id);
        }

        requestBody.infoHub.lastHealthTime = Date.now();
        await updateHubOrganEndpoints(hubOrganNode, requestBody.infoHub);
        
      }
    }
    return requestBody;
  }
}

async function updateOrganEndpoints(organNode, infoOrgan) {
  const endpoints = await organNode.getChildren('hasBmsEndpoint');
  for (const endpoint of endpoints) {
    if (endpoint.getName().get() === 'health_history') {
      // @ts-ignore
      SpinalGraphService._addNode(endpoint);
      var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(
        endpoint.getId().get()
      );
      await timeseries.insert(
        1,
        parseInt(infoOrgan.genericOrganData.lastHealthTime)
      );
      const model = await endpoint.element.load();
      model.currentValue.set(1);
    } else if (endpoint.getName().get() === 'reboot_history') {
      // @ts-ignore
      SpinalGraphService._addNode(endpoint);
      var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(
        endpoint.getId().get()
      );
      await timeseries.insert(
        1,
        parseInt(infoOrgan.genericOrganData.bootTimestamp)
      );
      const model = await endpoint.element.load();
      model.currentValue.set(1);
    } else if (endpoint.getName().get() === 'ram_history') {
      // @ts-ignore
      SpinalGraphService._addNode(endpoint);
      const chaine = infoOrgan.genericOrganData.ramRssUsed;
      const regex = /([\d.]+)\s*MB/;
      const match = chaine.match(regex);
      if (match) {
        const resRegex = parseFloat(match[1]);
        var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(
          endpoint.getId().get()
        );
        await timeseries.insert(resRegex, Date.now());
        const model = await endpoint.element.load();
        model.currentValue.set(resRegex);
      }
    } else if (endpoint.getName().get() === 'last_ping') {
      // @ts-ignore
      SpinalGraphService._addNode(endpoint);
      const model = await endpoint.element.load();
      model.currentValue.set(parseInt(infoOrgan.genericOrganData.lastHealthTime));
    }
  }
}

async function updateHubOrganEndpoints(hubOrganNode, infoHub) {
  const endpoints = await hubOrganNode.getChildren('hasBmsEndpoint');
        for (const endpoint of endpoints) {
          if (endpoint.getName().get() === 'reboot_history') {
            // @ts-ignore
            SpinalGraphService._addNode(endpoint);
            var timeseries =
              await spinalServiceTimeSeries().getOrCreateTimeSeries(
                endpoint.getId().get()
              );
            await timeseries.insert(
              1,
              parseInt(infoHub.bootTimestamp)
            );
            const model = await endpoint.element.load();
            model.currentValue.set(1);
          } else if (endpoint.getName().get() === 'health_history') {
            // @ts-ignore
            SpinalGraphService._addNode(endpoint);
            var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(
              endpoint.getId().get()
            );
            await timeseries.insert(
              1,
              infoHub.lastHealthTime
            );
            const model = await endpoint.element.load();
            model.currentValue.set(1);
            } else if (endpoint.getName().get() === 'ram_res') {
            // @ts-ignore
            SpinalGraphService._addNode(endpoint);
            var timeseries =
              await spinalServiceTimeSeries().getOrCreateTimeSeries(
                endpoint.getId().get()
              );
            await timeseries.insert(
              infoHub.ramUsageRes,
              infoHub.lastHealthTime
            );
            const model = await endpoint.element.load();
            model.currentValue.set(infoHub.ramUsageRes);
          } else if (endpoint.getName().get() === 'ram_virt') {
            // @ts-ignore
            SpinalGraphService._addNode(endpoint);
            var timeseries =
              await spinalServiceTimeSeries().getOrCreateTimeSeries(
                endpoint.getId().get()
              );
            await timeseries.insert(
              infoHub.ramUsageVirt,
              infoHub.lastHealthTime
            );
            const model = await endpoint.element.load();
            model.currentValue.set(infoHub.ramUsageVirt);
          } else if (endpoint.getName().get() === 'count_session') {
            // @ts-ignore
            SpinalGraphService._addNode(endpoint);
            var timeseries =
              await spinalServiceTimeSeries().getOrCreateTimeSeries(
                endpoint.getId().get()
              );
            await timeseries.insert(
              parseInt(infoHub.countSessions),
              infoHub.lastHealthTime
            );
            const model = await endpoint.element.load();
            model.currentValue.set(parseInt(infoHub.countSessions));
          } else if (endpoint.getName().get() === 'count_users') {
            // @ts-ignore
            SpinalGraphService._addNode(endpoint);
            var timeseries =
              await spinalServiceTimeSeries().getOrCreateTimeSeries(
                endpoint.getId().get()
              );
            await timeseries.insert(
              parseInt(infoHub.countUsers),
              infoHub.lastHealthTime
            );
            const model = await endpoint.element.load();
            model.currentValue.set(parseInt(infoHub.countUsers));
          }
          else if (endpoint.getName().get() === 'last_ping') {
            // @ts-ignore
            SpinalGraphService._addNode(endpoint);
            const model = await endpoint.element.load();
            model.currentValue.set(infoHub.lastHealthTime);
          }
        }

}


function isWithinTwoMinutes(timestamp: number) {
  var twoMinutesAgo = Date.now() - 2 * 60 * 1000; // calculate timestamp for 2 minutes ago
  return timestamp >= twoMinutesAgo && timestamp <= Date.now(); // check if timestamp is within 2 minutes
}

function compareTabs(organMonit, organBos: SpinalNode[]) {
  let resultat = [];
  organMonit.forEach((requestObj) => {
    let estPresent = organBos.some((organNode) => {
      // Comparaison des objets (à ajuster selon les besoins)
      return (
        JSON.stringify(requestObj.genericOrganData.name) ===
        organNode.getName().get()
      );
    });

    if (!estPresent) {
      resultat.push(requestObj);
    }
  });

  return resultat;
}

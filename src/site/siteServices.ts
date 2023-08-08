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
  SITE_TYPE,
  SITE_LIST,
  MONITORING_SERVICE_RELATION_TYPE_PTR_LST,
  CATEGORY_NAME,
  MONITORING_SERVICE_SITE_RELATION_NAME,
  MONITORING_SERVICE_SLA_RELATION_NAME,
  SLA_TYPE,
  MONITORING_SERVICE_PLATFORM_RELATION_NAME
} from '../constant';

import {
  SpinalGraphService,
  SpinalGraph,
} from 'spinal-env-viewer-graph-service';
import { OperationError } from '../utilities/operation-error';
import { HttpStatusCode } from '../utilities/http-status-code';
import {
  ISite,
  ISla,
  ISiteCreationParams,
  ISiteUpdateParams,
  ISlaCreationParams,
  IAddPlatform
} from './site.model';
import SpinalMiddleware from '../spinalMiddleware';
import serviceDocumentation from "spinal-env-viewer-plugin-documentation-service"
import { InputDataEndpoint, InputDataEndpointDataType, InputDataEndpointType } from 'spinal-model-bmsnetwork';
import getInstance from '../utilities/NetworkService';


export class SiteService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }

  public async createSite(siteService: ISiteCreationParams): Promise<ISite> {
    const context = SpinalGraphService.getContext(SITE_LIST);
    const siteObject: ISiteCreationParams = {
      type: SITE_TYPE,
      name: siteService.name,
      address: siteService.address,
      [Symbol.iterator]: function* () {
        let properties = Object.keys(this);
        for (let i of properties) {
          yield [i, this[i]];
        }
      }
    }

    const siteId = SpinalGraphService.createNode(siteObject, undefined)
    var res = await SpinalGraphService.addChildInContext(
      context.getId().get(),
      siteId,
      context.getId().get(),
      MONITORING_SERVICE_SITE_RELATION_NAME,
      MONITORING_SERVICE_RELATION_TYPE_PTR_LST
    );
    const category = await serviceDocumentation.addCategoryAttribute(res, CATEGORY_NAME)
    for (const [key, value] of siteObject) {
      await serviceDocumentation.addAttributeByCategoryName(res, category.nameCat, key, value)
    }
    let slaArray = []
    if (siteService.slas.length !== 0) {
      for (const sla of siteService.slas) {
        const slaObj: ISlaCreationParams = {
          name: sla.name,
          type: SLA_TYPE,
          [Symbol.iterator]: function* () {
            let properties = Object.keys(this);
            for (let i of properties) {
              yield [i, this[i]];
            }
          }
        }

        const slatId = SpinalGraphService.createNode(slaObj, undefined)
        var resSla = await SpinalGraphService.addChildInContext(
          siteId,
          slatId,
          context.getId().get(),
          MONITORING_SERVICE_SLA_RELATION_NAME,
          MONITORING_SERVICE_RELATION_TYPE_PTR_LST
        );
        const category = await serviceDocumentation.addCategoryAttribute(resSla, CATEGORY_NAME)
        for (const [key, value] of slaObj) {
          await serviceDocumentation.addAttributeByCategoryName(resSla, category.nameCat, key, value)
        }
        slaArray.push(slaObj)
      }
    }
    if (res !== undefined) {
      return {
        id: res.getId().get(),
        type: res.getType().get(),
        name: res.getName().get(),
        address: res.info.address.get(),
        slas: siteService.slas.length === 0 ? [] : slaArray
      }
    }
  }





  public async addSla(siteId: string, sla: ISlaCreationParams): Promise<ISla> {
    const context = SpinalGraphService.getContext(SITE_LIST)
    const sites = await context.getChildren(
      MONITORING_SERVICE_SITE_RELATION_NAME
    );
    for (const site of sites) {
      if (site.getId().get() === siteId) {
        // @ts-ignore
        SpinalGraphService._addNode(site)
        const slaObj: ISlaCreationParams = {
          name: sla.name,
          type: SLA_TYPE,
          [Symbol.iterator]: function* () {
            let properties = Object.keys(this);
            for (let i of properties) {
              yield [i, this[i]];
            }
          }
        }

        const slaId = SpinalGraphService.createNode(slaObj, undefined)
        var resSla = await SpinalGraphService.addChildInContext(
          site.getId().get(),
          slaId,
          context.getId().get(),
          MONITORING_SERVICE_SLA_RELATION_NAME,
          MONITORING_SERVICE_RELATION_TYPE_PTR_LST
        );

        const category = await serviceDocumentation.addCategoryAttribute(resSla, CATEGORY_NAME)
        for (const [key, value] of slaObj) {
          await serviceDocumentation.addAttributeByCategoryName(resSla, category.nameCat, key, value)
        }
        return {
          id: resSla.getId().get(),
          name: resSla.getName().get(),
          type: resSla.getType().get(),
        }
      }
    }
  }



  public async getSites(): Promise<ISite[]> {
    const context = SpinalGraphService.getContext(SITE_LIST)
    const sites = await context.getChildren(
      MONITORING_SERVICE_SITE_RELATION_NAME
    );
    const arraySite: ISite[] = []
    for (const site of sites) {
      let arraySla = []
      const slas = await site.getChildren(MONITORING_SERVICE_SLA_RELATION_NAME)
      for (const sla of slas) {
        arraySla.push({
          id: sla.getId().get(),
          name: sla.getName().get(),
          type: sla.getType().get(),
        })
      }
      let siteObject: any = {}
      const attrs = await serviceDocumentation.getAttributesByCategory(site, CATEGORY_NAME);
      for (const attr of attrs) {
        if (attr.label.get() === 'id') Object.assign(siteObject, { id: attr.value.get() });
        else if (attr.label.get() === 'type') Object.assign(siteObject, { type: attr.value.get() });
        else if (attr.label.get() === 'name') Object.assign(siteObject, { name: attr.value.get() });
        else if (attr.label.get() === 'adress') Object.assign(siteObject, { adress: attr.value.get() });
      }
      Object.assign(siteObject, { Slas: arraySla });
      arraySite.push(siteObject);
    }
    return arraySite;
  }





  public async getSite(siteId: string): Promise<ISite> {
    const context = SpinalGraphService.getContext(SITE_LIST)
    const sites = await context.getChildren(
      MONITORING_SERVICE_SITE_RELATION_NAME
    );
    for (const site of sites) {
      if (site.getId().get() === siteId) {
        let arraySla = []
        const slas = await site.getChildren(MONITORING_SERVICE_SLA_RELATION_NAME)
        for (const sla of slas) {
          arraySla.push({
            id: sla.getId().get(),
            name: sla.getName().get(),
            type: sla.getType().get(),
          })
        }

        const attrs = await serviceDocumentation.getAttributesByCategory(site, CATEGORY_NAME);
        var siteObject: any = {}
        for (const attr of attrs) {
          if (attr.label.get() === 'id') Object.assign(siteObject, { id: attr.value.get() });
          else if (attr.label.get() === 'type') Object.assign(siteObject, { type: attr.value.get() });
          else if (attr.label.get() === 'name') Object.assign(siteObject, { name: attr.value.get() });
          else if (attr.label.get() === 'service') Object.assign(siteObject, { service: attr.value.get() });
        }
        Object.assign(siteObject, { slas: arraySla });
        return siteObject
      }
    }
  }


  public async deleteSite(siteId: string): Promise<void> {
    const context = SpinalGraphService.getContext(SITE_LIST)
    const sites = await context.getChildren(
      MONITORING_SERVICE_SITE_RELATION_NAME
    );
    for (const site of sites) {
      if (site.getId().get() === siteId) {
        await site.removeFromGraph()
      }
    }
  }




  public async addPlatform(requestBody: IAddPlatform): Promise<void> {
    const context = SpinalGraphService.getContext(SITE_LIST)
    const sites = await context.getChildren(
      MONITORING_SERVICE_SITE_RELATION_NAME
    );
    for (const site of sites) {
      if (site.getId().get() === requestBody.siteId) {
        // @ts-ignore
        SpinalGraphService._addNode(site)
        var addchild = await SpinalGraphService.addChild(
          site.getId().get(),
          requestBody.platformId,
          MONITORING_SERVICE_PLATFORM_RELATION_NAME,
          MONITORING_SERVICE_RELATION_TYPE_PTR_LST
        );
        if (addchild) {
          // const category = await serviceDocumentation.addCategoryAttribute(site, CATEGORY_NAME)
          // await serviceDocumentation.addAttributeByCategoryName(ressla, category.nameCat, key, value)
          console.error("platform not added")
        }
      }
    }
  }



  public async updateSite(siteId: string, requestBody: ISiteUpdateParams): Promise<ISite> {
    const context = SpinalGraphService.getContext(SITE_LIST)
    const sites = await context.getChildren(
      MONITORING_SERVICE_SITE_RELATION_NAME
    );
    for (const site of sites) {
      if (site.getId().get() === siteId) {
        const attrs = await serviceDocumentation.getAttributesByCategory(site, CATEGORY_NAME);
        for (const attr of attrs) {
          if (attr.label.get() === 'name') serviceDocumentation.setAttributeById(site, attr._server_id, 'name', requestBody.name, attr.type.get(), attr.unit.get())
          else if (attr.label.get() === 'address') serviceDocumentation.setAttributeById(site, attr._server_id, 'address', requestBody.address, attr.type.get(), attr.unit.get())
        }



        let arraySla = []
        const slas = await site.getChildren(MONITORING_SERVICE_SLA_RELATION_NAME)
        for (const sla of slas) {
          arraySla.push({
            id: sla.getId().get(),
            name: sla.getName().get(),
            type: sla.getType().get(),
          })
        }

        const attrsres = await serviceDocumentation.getAttributesByCategory(site, CATEGORY_NAME);
        var siteObject: any = {}
        for (const attr of attrsres) {
          if (attr.label.get() === 'id') Object.assign(siteObject, { id: attr.value.get() });
          else if (attr.label.get() === 'type') Object.assign(siteObject, { type: attr.value.get() });
          else if (attr.label.get() === 'name') Object.assign(siteObject, { name: attr.value.get() });
          else if (attr.label.get() === 'address') Object.assign(siteObject, { address: attr.value.get() });
        }
        Object.assign(siteObject, { slas: arraySla });
        return siteObject
      }
    }


  }

}
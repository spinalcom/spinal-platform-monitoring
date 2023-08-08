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
  BUILDING_TYPE,
  BUILDING_LIST,
  MONITORING_SERVICE_RELATION_TYPE_PTR_LST,
  CATEGORY_NAME,
  MONITORING_SERVICE_BUILDING_RELATION_NAME,
  MONITORING_SERVICE_PLATFORM_RELATION_NAME
} from '../constant';
import {
  SpinalGraphService,
  SpinalGraph,
} from 'spinal-env-viewer-graph-service';
import { OperationError } from '../utilities/operation-error';
import { HttpStatusCode } from '../utilities/http-status-code';
import {
  IBuilding,
  IBuildingCreationParams,
  IBuildingUpdateParams,
  IAddPlatform
} from './building.model';

import SpinalMiddleware from '../spinalMiddleware';
import serviceDocumentation from "spinal-env-viewer-plugin-documentation-service"
import { InputDataEndpoint, InputDataEndpointDataType, InputDataEndpointType } from 'spinal-model-bmsnetwork';
import getInstance from '../utilities/NetworkService';


export class BuildingService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }

  public async createBuilding(buildingService: IBuildingCreationParams): Promise<IBuilding> {
    const context = SpinalGraphService.getContext(BUILDING_LIST);
    const buildingObject: IBuildingCreationParams = {
      type: BUILDING_TYPE,
      name: buildingService.name,
      address: buildingService.address,
      [Symbol.iterator]: function* () {
        let properties = Object.keys(this);
        for (let i of properties) {
          yield [i, this[i]];
        }
      }
    }

    const buildingId = SpinalGraphService.createNode(buildingObject, undefined)
    var res = await SpinalGraphService.addChildInContext(
      context.getId().get(),
      buildingId,
      context.getId().get(),
      MONITORING_SERVICE_BUILDING_RELATION_NAME,
      MONITORING_SERVICE_RELATION_TYPE_PTR_LST
    );
    const category = await serviceDocumentation.addCategoryAttribute(res, CATEGORY_NAME)
    for (const [key, value] of buildingObject) {
      await serviceDocumentation.addAttributeByCategoryName(res, category.nameCat, key, value)
    }
    if (res !== undefined) {
      return {
        id: res.getId().get(),
        type: res.getType().get(),
        name: res.getName().get(),
        address: res.info.address.get(),
      }
    }
  }


  public async getBuildings(): Promise<IBuilding[]> {
    const context = SpinalGraphService.getContext(BUILDING_LIST)
    const buildings = await context.getChildren(
      MONITORING_SERVICE_BUILDING_RELATION_NAME
    );
    const arrayBuilding: IBuilding[] = []
    for (const building of buildings) {
      let buildingObject: any = {}
      const attrs = await serviceDocumentation.getAttributesByCategory(building, CATEGORY_NAME);
      for (const attr of attrs) {
        if (attr.label.get() === 'id') Object.assign(buildingObject, { id: attr.value.get() });
        else if (attr.label.get() === 'type') Object.assign(buildingObject, { type: attr.value.get() });
        else if (attr.label.get() === 'name') Object.assign(buildingObject, { name: attr.value.get() });
        else if (attr.label.get() === 'address') Object.assign(buildingObject, { address: attr.value.get() });
      }
      arrayBuilding.push(buildingObject);
    }
    return arrayBuilding;
  }





  public async getBuilding(buildingId: string): Promise<IBuilding> {
    const context = SpinalGraphService.getContext(BUILDING_LIST)
    const buildings = await context.getChildren(
      MONITORING_SERVICE_BUILDING_RELATION_NAME
    );
    for (const building of buildings) {
      if (building.getId().get() === buildingId) {
        const attrs = await serviceDocumentation.getAttributesByCategory(building, CATEGORY_NAME);
        var buildingObject: any = {}
        for (const attr of attrs) {
          if (attr.label.get() === 'id') Object.assign(buildingObject, { id: attr.value.get() });
          else if (attr.label.get() === 'type') Object.assign(buildingObject, { type: attr.value.get() });
          else if (attr.label.get() === 'name') Object.assign(buildingObject, { name: attr.value.get() });
          else if (attr.label.get() === 'address') Object.assign(buildingObject, { address: attr.value.get() });
        }
        return buildingObject
      }
    }
  }




  public async deleteBuilding(buildingId: string): Promise<void> {
    const context = SpinalGraphService.getContext(BUILDING_LIST)
    const buildings = await context.getChildren(
      MONITORING_SERVICE_BUILDING_RELATION_NAME
    );
    for (const building of buildings) {
      if (building.getId().get() === buildingId) {
        await building.removeFromGraph()
      }
    }
  }




  public async addPlatform(requestBody: IAddPlatform): Promise<void> {
    const context = SpinalGraphService.getContext(BUILDING_LIST)
    const buildings = await context.getChildren(
      MONITORING_SERVICE_BUILDING_RELATION_NAME
    );
    for (const building of buildings) {
      if (building.getId().get() === requestBody.buildingId) {
        // @ts-ignore
        SpinalGraphService._addNode(building)
        var addchild = await SpinalGraphService.addChild(
          building.getId().get(),
          requestBody.platformId,
          MONITORING_SERVICE_PLATFORM_RELATION_NAME,
          MONITORING_SERVICE_RELATION_TYPE_PTR_LST
        );
        if (addchild) {
          // const category = await serviceDocumentation.addCategoryAttribute(building, CATEGORY_NAME)
          // await serviceDocumentation.addAttributeByCategoryName(resContact, category.nameCat, key, value)
          console.error("platform not added")
        }
      }
    }
  }



  public async updateBuilding(buildingId: string, requestBody: IBuildingUpdateParams): Promise<IBuilding> {
    const context = SpinalGraphService.getContext(BUILDING_LIST)
    const buildings = await context.getChildren(
      MONITORING_SERVICE_BUILDING_RELATION_NAME
    );
    for (const building of buildings) {
      if (building.getId().get() === buildingId) {
        const attrs = await serviceDocumentation.getAttributesByCategory(building, CATEGORY_NAME);
        for (const attr of attrs) {
          if (attr.label.get() === 'name') serviceDocumentation.setAttributeById(building, attr._server_id, 'name', requestBody.name, attr.type.get(), attr.unit.get())
          else if (attr.label.get() === 'address') serviceDocumentation.setAttributeById(building, attr._server_id, 'address', requestBody.address, attr.type.get(), attr.unit.get())
        }

        const attrsres = await serviceDocumentation.getAttributesByCategory(building, CATEGORY_NAME);
        var buildingObject: any = {}
        for (const attr of attrsres) {
          if (attr.label.get() === 'id') Object.assign(buildingObject, { id: attr.value.get() });
          else if (attr.label.get() === 'type') Object.assign(buildingObject, { type: attr.value.get() });
          else if (attr.label.get() === 'name') Object.assign(buildingObject, { name: attr.value.get() });
          else if (attr.label.get() === 'address') Object.assign(buildingObject, { address: attr.value.get() });
        }
        return buildingObject
      }
    }
  }

}

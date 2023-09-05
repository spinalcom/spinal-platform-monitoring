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
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Route,
  Security,
  SuccessResponse,
} from 'tsoa';
import {
  IBuilding,
  IBuildingCreationParams,
  IBuildingUpdateParams,
  IAddPlatform,
  LinkParamBuildingToPlatform,

} from "./building.model";
import { BuildingService } from './buildingServices';

@Route('buildings')
export class BuildingController extends Controller {
  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  public async createBuilding(
    @Body() requestBody: IBuildingCreationParams
  ): Promise<IBuilding> {
    let building = new BuildingService().createBuilding(requestBody);
    this.setStatus(201); // set return status 201rt
    return building;
  }

  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post('linkBuildingToPlatform')
  public async linkBuildingToPlatform(
    @Body() requestBody: LinkParamBuildingToPlatform,
  ): Promise<void> {
    new BuildingService().linkBuildingToPlatform(requestBody);
    this.setStatus(201); // set return status 201rt
  }


  @Security('jwt')
  @SuccessResponse('201', 'Updated') // Custom success response
  @Put('{buildingId}')
  public async updateBuilding(
    @Body() requestBody: IBuildingUpdateParams,
    @Path() buildingId: string
  ): Promise<IBuilding> {
    let building = new BuildingService().updateBuilding(buildingId, requestBody);
    this.setStatus(201); // set return status 201rt
    return building;
  }

  @Security('jwt')
  @Get()
  public async getBuildings(): Promise<IBuilding[]> {
    this.setStatus(201); // set return status 201
    return new BuildingService().getBuildings();
  }
  @Security('jwt')
  @Get('{buildingId}')
  public async getBuilding(@Path() buildingId: string): Promise<IBuilding> {
    this.setStatus(201); // set return status 201
    return new BuildingService().getBuilding(buildingId);
  }

  @Security('jwt')
  @Delete('{buildingId}')
  public async deleteBuilding(
    @Path() buildingId: string,
  ): Promise<void> {
    return new BuildingService().deleteBuilding(buildingId);
  }


}

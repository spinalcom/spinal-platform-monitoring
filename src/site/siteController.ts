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
  ISite,
  ISla,
  ISiteCreationParams,
  ISiteUpdateParams,
  ISlaCreationParams,
  IAddPlatform
} from './site.model';
import { SiteService } from './siteServices';

@Route('sites')
export class SiteController extends Controller {
  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  public async createSite(
    @Body() requestBody: ISiteCreationParams
  ): Promise<ISite> {
    let site = new SiteService().createSite(requestBody);
    this.setStatus(201); // set return status 201rt
    return site;
  }

  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post('addPlatform')
  public async addPlatform(
    @Body() requestBody: IAddPlatform,
  ): Promise<void> {
    new SiteService().addPlatform(requestBody);
    this.setStatus(201); // set return status 201rt
  }



  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post('{siteId}/addSla')
  public async addSla(
    @Body() requestBody: ISlaCreationParams,
    @Path() siteId: string
  ): Promise<ISla> {
    let sla = new SiteService().addSla(siteId, requestBody);
    this.setStatus(201); // set return status 201rt
    return sla;
  }

  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Put('{siteId}')
  public async updateSite(
    @Body() requestBody: ISiteUpdateParams,
    @Path() siteId: string
  ): Promise<ISite> {
    let site = new SiteService().updateSite(siteId, requestBody);
    this.setStatus(201); // set return status 201rt
    return site;
  }


  @Security('jwt')
  @Get()
  public async getSites(): Promise<ISite[]> {
    this.setStatus(201); // set return status 201
    return new SiteService().getSites();
  }
  @Security('jwt')
  @Get('{siteId}')
  public async getSite(@Path() siteId: string): Promise<ISite> {
    this.setStatus(201); // set return status 201
    return new SiteService().getSite(siteId);
  }

  @Security('jwt')
  @Delete('{siteId}')
  public async deleteSite(
    @Path() siteId: string,
  ): Promise<void> {
    return new SiteService().deleteSite(siteId);
  }
}
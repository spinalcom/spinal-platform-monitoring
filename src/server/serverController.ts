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
  IServer,
  IServerCreationParams,
  IServerUpdateParams
} from './server.model'
import { ServerService } from './serverServices';

@Route('servers')
export class ServersController extends Controller {
  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  public async createServer(
    @Body() requestBody: any
  ): Promise<IServer> {
    let server = new ServerService().createServer(requestBody);
    this.setStatus(201); // set return status 201rt
    return server;
  }

  // @Security('jwt')
  // @Get()
  // public async getOrgans(): Promise<IOrgan[]> {
  //   this.setStatus(201); // set return status 201
  //   return new OrganService().getOrgans();
  // }

  // @Security('jwt')
  // @Get('{organId}')
  // public async getOrgan(@Path() organId: string,
  // ): Promise<IOrgan> {
  //   this.setStatus(201); // set return status 201
  //   return new OrganService().getOrgan(organId);
  // }


  // @Security('jwt')
  // @Delete('{organId}')
  // public async deleteOrgan(
  //   @Path() organId: string,
  // ): Promise<void> {
  //   return new OrganService().deleteOrgan(organId);
  // }
}
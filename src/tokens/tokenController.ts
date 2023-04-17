/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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
import { IToken, IUserToken, IApplicationToken } from './token.model';
import { TokensService } from './tokenService';

@Route('tokens')
export class TokensController extends Controller {
  @Security('jwt')
  @Get()
  public async getTokens(): Promise<IToken[]> {
    this.setStatus(201); // set return status 201
    return new TokensService().getTokens();
  }

  @Security('jwt')
  @Get('/UserToken')
  public async getUserTokens(): Promise<IToken[]> {
    this.setStatus(201); // set return status 201
    return new TokensService().getUserTokens();
  }

  @Security('jwt')
  @Get('/ApplicationToken')
  public async getApplicationTokens(): Promise<IToken[]> {
    this.setStatus(201); // set return status 201
    return new TokensService().getApplicationTokens();
  }

  @Security('jwt')
  @Post('/getUserProfileByToken')
  public async getUserProfileByToken(@Body() requestBody: any): Promise<any> {
    this.setStatus(201); // set return status 201
    return new TokensService().getUserProfileByToken(
      requestBody.token,
      requestBody.platformId
    );
  }

  @Security('jwt')
  @Post('/getAppProfileByToken')
  public async getAppProfileByToken(@Body() requestBody: any): Promise<any> {
    this.setStatus(201); // set return status 201
    return new TokensService().getAppProfileByToken(
      requestBody.token,
      requestBody.platformId
    );
  }

  @Post('/verifyToken')
  public async verifyToken(@Body() requestBody: any): Promise<any> {
    return new TokensService().verifyToken(
      requestBody.tokenParam,
      requestBody.actor
    );
  }
}

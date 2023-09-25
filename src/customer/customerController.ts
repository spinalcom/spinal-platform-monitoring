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
  ICustomer,
  IContact,
  ICustomerCreationParams,
  ICustomerUpdateParams,
  IContactCreationParams,
  IAddPlatform,
  LinkParamCustomerToSite
} from './customer.model';
import { CustomerService } from './customerServices';



@Route('customers')
export class CustomerController extends Controller {
  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  public async createCustomer(
    @Body() requestBody: ICustomerCreationParams
  ): Promise<ICustomer> {
    let customer = new CustomerService().createCustomer(requestBody);
    this.setStatus(201); // set return status 201rt
    return customer;
  }



  @Security('jwt')
  @Post('addPlatform')
  public async addPlatform(
    @Body() requestBody: IAddPlatform,
  ): Promise<void> {
    new CustomerService().addPlatform(requestBody);
  }

  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post('linkCustomerToSite')
  public async linkCustomerToSite(
    @Body() requestBody: LinkParamCustomerToSite,
  ): Promise<void> {
    new CustomerService().linkCustomerToSite(requestBody);
    this.setStatus(201); // set return status 201rt
  }


  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Post('{customerId}/addContact')
  public async addContact(
    @Body() requestBody: IContactCreationParams,
    @Path() customerId: string
  ): Promise<IContact> {
    let contact = new CustomerService().addContacte(customerId, requestBody);
    this.setStatus(201); // set return status 201rt
    return contact;
  }

  @Security('jwt')
  @SuccessResponse('201', 'Created') // Custom success response
  @Put('{customerId}')
  public async updateCustomer(
    @Body() requestBody: ICustomerUpdateParams,
    @Path() customerId: string
  ): Promise<ICustomer> {
    let customer = new CustomerService().updateCustomer(customerId, requestBody);
    this.setStatus(201); // set return status 201rt
    return customer;
  }


  @Security('jwt')
  @Get()
  public async getCustomers(): Promise<ICustomer[]> {
    this.setStatus(201); // set return status 201
    return new CustomerService().getCustomers();
  }
  @Security('jwt')
  @Get('{customerId}')
  public async getCustomer(@Path() customerId: string): Promise<ICustomer> {
    this.setStatus(201); // set return status 201
    return new CustomerService().getCustomer(customerId);
  }

  @Security('jwt')
  @Delete('{customerId}')
  public async deleteCustomer(
    @Path() customerId: string,
  ): Promise<void> {
    return new CustomerService().deleteCustomer(customerId);
  }


}
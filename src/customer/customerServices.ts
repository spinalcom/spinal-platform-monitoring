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
  CUSTOMER_TYPE,
  CUSTOMER_LIST,
  MONITORING_SERVICE_RELATION_TYPE_PTR_LST,
  CATEGORY_NAME,
  MONITORING_SERVICE_CUSTOMER_RELATION_NAME,
  MONITORING_SERVICE_SITE_RELATION_NAME,
  MONITORING_SERVICE_CONTACT_RELATION_NAME,
  CONTACT_TYPE,
  MONITORING_SERVICE_PLATFORM_RELATION_NAME,
  SITE_LIST,
  PLATFORM_LIST
} from '../constant';
import {
  SpinalGraphService,
  SpinalGraph,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import { OperationError } from '../utilities/operation-error';
import { HttpStatusCode } from '../utilities/http-status-code';
import {
  ICustomer, IContact,
  ICustomerCreationParams,
  ICustomerUpdateParams,
  IContactCreationParams,
  IContactUpdateParams,
  IAddPlatform,
  LinkParamCustomerToSite
} from './customer.model';

import SpinalMiddleware from '../spinalMiddleware';
import serviceDocumentation from "spinal-env-viewer-plugin-documentation-service"


export class CustomerService {
  public spinalMiddleware: SpinalMiddleware = SpinalMiddleware.getInstance();
  public graph: SpinalGraph<any>;
  constructor() {
    this.spinalMiddleware.init();
    this.graph = this.spinalMiddleware.getGraph();
  }



  public async createCustomer(customerService: ICustomerCreationParams): Promise<ICustomer> {
    const context = SpinalGraphService.getContext(CUSTOMER_LIST);
    const customerObject: ICustomerCreationParams = {
      type: CUSTOMER_TYPE,
      name: customerService.name,
      service: customerService.service,
      [Symbol.iterator]: function* () {
        let properties = Object.keys(this);
        for (let i of properties) {
          yield [i, this[i]];
        }
      }
    }

    const customerId = SpinalGraphService.createNode({ type: CUSTOMER_TYPE }, undefined)
    var res = await SpinalGraphService.addChildInContext(
      context.getId().get(),
      customerId,
      context.getId().get(),
      MONITORING_SERVICE_CUSTOMER_RELATION_NAME,
      MONITORING_SERVICE_RELATION_TYPE_PTR_LST
    );
    const category = await serviceDocumentation.addCategoryAttribute(res, CATEGORY_NAME)
    for (const [key, value] of customerObject) {
      await serviceDocumentation.addAttributeByCategoryName(res, category.nameCat, key, value)
    }
    let contactArray = []
    if (customerService.contacts.length !== 0) {
      for (const contact of customerService.contacts) {
        const contactObj: IContactCreationParams = {
          name: contact.name,
          type: CONTACT_TYPE,
          email: contact.email,
          telephone: contact.telephone,
          category: contact.category,
          [Symbol.iterator]: function* () {
            let properties = Object.keys(this);
            for (let i of properties) {
              yield [i, this[i]];
            }
          }
        }

        const contactId = SpinalGraphService.createNode({ type: CONTACT_TYPE }, undefined)
        var resContact = await SpinalGraphService.addChildInContext(
          customerId,
          contactId,
          context.getId().get(),
          MONITORING_SERVICE_CONTACT_RELATION_NAME,
          MONITORING_SERVICE_RELATION_TYPE_PTR_LST
        );
        const category = await serviceDocumentation.addCategoryAttribute(resContact, CATEGORY_NAME)
        for (const [key, value] of contactObj) {
          await serviceDocumentation.addAttributeByCategoryName(resContact, category.nameCat, key, value)
        }
        contactArray.push(contactObj)
      }
    }
    if (res !== undefined) {
      return {
        id: res.getId().get(),
        type: res.getType().get(),
        name: res.getName().get(),
        service: res.info.service.get(),
        contacts: customerService.contacts.length === 0 ? [] : contactArray
      }
    }
  }


  public async addContacte(customerId: string, contact: IContactCreationParams): Promise<IContact> {
    const context = SpinalGraphService.getContext(CUSTOMER_LIST)
    const customers = await context.getChildren(
      MONITORING_SERVICE_CUSTOMER_RELATION_NAME
    );
    for (const customer of customers) {
      if (customer.getId().get() === customerId) {
        // @ts-ignore
        SpinalGraphService._addNode(customer)
        const contactObj: IContactCreationParams = {
          name: contact.name,
          type: CONTACT_TYPE,
          email: contact.email,
          telephone: contact.telephone,
          category: contact.category,
          [Symbol.iterator]: function* () {
            let properties = Object.keys(this);
            for (let i of properties) {
              yield [i, this[i]];
            }
          }
        }

        const contactId = SpinalGraphService.createNode({ type: CONTACT_TYPE }, undefined)
        var resContact = await SpinalGraphService.addChildInContext(
          customer.getId().get(),
          contactId,
          context.getId().get(),
          MONITORING_SERVICE_CONTACT_RELATION_NAME,
          MONITORING_SERVICE_RELATION_TYPE_PTR_LST
        );

        const category = await serviceDocumentation.addCategoryAttribute(resContact, CATEGORY_NAME)
        for (const [key, value] of contactObj) {
          await serviceDocumentation.addAttributeByCategoryName(resContact, category.nameCat, key, value)
        }
        const attrsres = await serviceDocumentation.getAttributesByCategory(resContact, CATEGORY_NAME);
        var contactObject: IContact = {}
        for (const attr of attrsres) {
          if (attr.label.get() === 'id') Object.assign(contactObject, { id: attr.value.get() });
          else if (attr.label.get() === 'name') Object.assign(contactObject, { name: attr.value.get() });
          else if (attr.label.get() === 'type') Object.assign(contactObject, { type: attr.value.get() });
          else if (attr.label.get() === 'email') Object.assign(contactObject, { email: attr.value.get() });
          else if (attr.label.get() === 'telephone') Object.assign(contactObject, { telephone: attr.value.get() });
          else if (attr.label.get() === 'category') Object.assign(contactObject, { category: attr.value.get() });
        }
        return contactObject
      }
    }
  }

  public async deleteContact(contactId: string): Promise<void> {
    const context = SpinalGraphService.getContext(CUSTOMER_LIST)
    const customers = await context.getChildren(
      MONITORING_SERVICE_CUSTOMER_RELATION_NAME
    );
    for (const customer of customers) {
      const contacts = await customer.getChildren(MONITORING_SERVICE_CONTACT_RELATION_NAME)
      for (const contact of contacts) {
        if (contact.getId().get() === contactId) {
          await contact.removeFromGraph()
        }
      }
    }
  }

  public async updateContact(contactId: string, requestBody: IContactUpdateParams): Promise<IContact> {
    const context = SpinalGraphService.getContext(CUSTOMER_LIST)
    const customers = await context.getChildren(
      MONITORING_SERVICE_CUSTOMER_RELATION_NAME
    );
    for (const customer of customers) {
      const contacts = await customer.getChildren(MONITORING_SERVICE_CONTACT_RELATION_NAME)
      for (const contact of contacts) {
        if (contact.getId().get() === contactId) {
          const attrs = await serviceDocumentation.getAttributesByCategory(contact, CATEGORY_NAME);
          for (const attr of attrs) {
            if (attr.label.get() === 'name') serviceDocumentation.setAttributeById(contact, attr._server_id, 'name', requestBody.name, attr.type.get(), attr.unit.get())
            else if (attr.label.get() === 'email') serviceDocumentation.setAttributeById(contact, attr._server_id, 'email', requestBody.email, attr.type.get(), attr.unit.get())
            else if (attr.label.get() === 'telephone') serviceDocumentation.setAttributeById(contact, attr._server_id, 'telephone', requestBody.telephone, attr.type.get(), attr.unit.get())
            else if (attr.label.get() === 'category') serviceDocumentation.setAttributeById(contact, attr._server_id, 'category', requestBody.category, attr.type.get(), attr.unit.get())
          }
          const attrsres = await serviceDocumentation.getAttributesByCategory(contact, CATEGORY_NAME);
          var contactObject: IContact = {}
          for (const attr of attrsres) {
            if (attr.label.get() === 'id') Object.assign(contactObject, { id: attr.value.get() });
            else if (attr.label.get() === 'name') Object.assign(contactObject, { name: attr.value.get() });
            else if (attr.label.get() === 'type') Object.assign(contactObject, { type: attr.value.get() });
            else if (attr.label.get() === 'email') Object.assign(contactObject, { email: attr.value.get() });
            else if (attr.label.get() === 'telephone') Object.assign(contactObject, { telephone: attr.value.get() });
            else if (attr.label.get() === 'category') Object.assign(contactObject, { category: attr.value.get() });
          }
          return contactObject
        }
      }
    }
  }


  public async getCustomers(): Promise<ICustomer[]> {
    const context = SpinalGraphService.getContext(CUSTOMER_LIST)
    const customers = await context.getChildren(
      MONITORING_SERVICE_CUSTOMER_RELATION_NAME
    );
    const arrayCustomer: ICustomer[] = []
    for (const customer of customers) {
      let arrayContact = []
      const contacts = await customer.getChildren(MONITORING_SERVICE_CONTACT_RELATION_NAME)
      for (const contact of contacts) {
        const attrsres = await serviceDocumentation.getAttributesByCategory(contact, CATEGORY_NAME);
        var contactObject: IContact = {}
        for (const attr of attrsres) {
          if (attr.label.get() === 'id') Object.assign(contactObject, { id: attr.value.get() });
          else if (attr.label.get() === 'name') Object.assign(contactObject, { name: attr.value.get() });
          else if (attr.label.get() === 'type') Object.assign(contactObject, { type: attr.value.get() });
          else if (attr.label.get() === 'email') Object.assign(contactObject, { email: attr.value.get() });
          else if (attr.label.get() === 'telephone') Object.assign(contactObject, { telephone: attr.value.get() });
          else if (attr.label.get() === 'category') Object.assign(contactObject, { category: attr.value.get() });
        }
        arrayContact.push(contactObject)
      }
      let customerObject: any = {}
      const attrs = await serviceDocumentation.getAttributesByCategory(customer, CATEGORY_NAME);
      for (const attr of attrs) {
        if (attr.label.get() === 'id') Object.assign(customerObject, { id: attr.value.get() });
        else if (attr.label.get() === 'type') Object.assign(customerObject, { type: attr.value.get() });
        else if (attr.label.get() === 'name') Object.assign(customerObject, { name: attr.value.get() });
        else if (attr.label.get() === 'service') Object.assign(customerObject, { service: attr.value.get() });
      }
      Object.assign(customerObject, { contacts: arrayContact });
      arrayCustomer.push(customerObject);
    }
    return arrayCustomer;
  }


  public async getCustomer(customerId: string): Promise<ICustomer> {
    const context = SpinalGraphService.getContext(CUSTOMER_LIST)
    const customers = await context.getChildren(
      MONITORING_SERVICE_CUSTOMER_RELATION_NAME
    );
    for (const customer of customers) {
      if (customer.getId().get() === customerId) {
        let arrayContact = []
        const contacts = await customer.getChildren(MONITORING_SERVICE_CONTACT_RELATION_NAME)
        for (const contact of contacts) {
          const attrsres = await serviceDocumentation.getAttributesByCategory(contact, CATEGORY_NAME);
          var contactObject: IContact = {}
          for (const attr of attrsres) {
            if (attr.label.get() === 'id') Object.assign(contactObject, { id: attr.value.get() });
            else if (attr.label.get() === 'name') Object.assign(contactObject, { name: attr.value.get() });
            else if (attr.label.get() === 'type') Object.assign(contactObject, { type: attr.value.get() });
            else if (attr.label.get() === 'email') Object.assign(contactObject, { email: attr.value.get() });
            else if (attr.label.get() === 'telephone') Object.assign(contactObject, { telephone: attr.value.get() });
            else if (attr.label.get() === 'category') Object.assign(contactObject, { category: attr.value.get() });
          }
          arrayContact.push(contactObject)
        }
        var customerObject: any = {}
        const attrs = await serviceDocumentation.getAttributesByCategory(customer, CATEGORY_NAME);
        for (const attr of attrs) {
          if (attr.label.get() === 'id') Object.assign(customerObject, { id: attr.value.get() });
          else if (attr.label.get() === 'type') Object.assign(customerObject, { type: attr.value.get() });
          else if (attr.label.get() === 'name') Object.assign(customerObject, { name: attr.value.get() });
          else if (attr.label.get() === 'service') Object.assign(customerObject, { service: attr.value.get() });
        }
        Object.assign(customerObject, { contacts: arrayContact });
        return customerObject
      }
    }
  }

  public async deleteCustomer(customerId: string): Promise<void> {
    const context = SpinalGraphService.getContext(CUSTOMER_LIST)
    const customers = await context.getChildren(
      MONITORING_SERVICE_CUSTOMER_RELATION_NAME
    );
    for (const customer of customers) {
      if (customer.getId().get() === customerId) {
        await customer.removeFromGraph()
      }
    }
  }




  public async addPlatform(requestBody: IAddPlatform): Promise<void> {

    var foundCustomer: SpinalNode;
    var foundPlatform: SpinalNode;
    const customerContext = SpinalGraphService.getContext(CUSTOMER_LIST)
    const platformContext = SpinalGraphService.getContext(PLATFORM_LIST)
    const customers = await customerContext.getChildren(
      MONITORING_SERVICE_CUSTOMER_RELATION_NAME
    );
    const platforms = await platformContext.getChildren(
      MONITORING_SERVICE_PLATFORM_RELATION_NAME
    );
    for (const customer of customers) {
      if (customer.getId().get() === requestBody.customerId) {
        foundCustomer = customer;
        // @ts-ignore
        SpinalGraphService._addNode(customer);
      }
    }
    for (const platform of platforms) {
      if (platform.getId().get() === requestBody.platformId) {
        foundPlatform = platform;
        // @ts-ignore
        SpinalGraphService._addNode(platform);
      }
    }
    if (foundCustomer === undefined || foundPlatform === undefined) {
      throw new OperationError(
        'NOT_FOUND',
        HttpStatusCode.FORBIDDEN
      );
    }
    await SpinalGraphService.addChild(foundCustomer.getId().get(), foundPlatform.getId().get(), MONITORING_SERVICE_PLATFORM_RELATION_NAME, MONITORING_SERVICE_RELATION_TYPE_PTR_LST);
  }


  public async updateCustomer(customerId: string, requestBody: ICustomerUpdateParams): Promise<ICustomer> {
    const context = SpinalGraphService.getContext(CUSTOMER_LIST)
    const customers = await context.getChildren(
      MONITORING_SERVICE_CUSTOMER_RELATION_NAME
    );
    for (const customer of customers) {
      if (customer.getId().get() === customerId) {
        const attrs = await serviceDocumentation.getAttributesByCategory(customer, CATEGORY_NAME);
        for (const attr of attrs) {
          if (attr.label.get() === 'name') serviceDocumentation.setAttributeById(customer, attr._server_id, 'name', requestBody.name, attr.type.get(), attr.unit.get())
          else if (attr.label.get() === 'service') serviceDocumentation.setAttributeById(customer, attr._server_id, 'service', requestBody.service, attr.type.get(), attr.unit.get())
        }
        let arrayContact = []
        const contacts = await customer.getChildren(MONITORING_SERVICE_CONTACT_RELATION_NAME)
        for (const contact of contacts) {
          const attrsres = await serviceDocumentation.getAttributesByCategory(contact, CATEGORY_NAME);
          var contactObject: IContact = {}
          for (const attr of attrsres) {
            if (attr.label.get() === 'id') Object.assign(contactObject, { id: attr.value.get() });
            else if (attr.label.get() === 'name') Object.assign(contactObject, { name: attr.value.get() });
            else if (attr.label.get() === 'type') Object.assign(contactObject, { type: attr.value.get() });
            else if (attr.label.get() === 'email') Object.assign(contactObject, { email: attr.value.get() });
            else if (attr.label.get() === 'telephone') Object.assign(contactObject, { telephone: attr.value.get() });
            else if (attr.label.get() === 'category') Object.assign(contactObject, { category: attr.value.get() });
          }
          arrayContact.push(contactObject)
        }
        const attrsres = await serviceDocumentation.getAttributesByCategory(customer, CATEGORY_NAME);
        var customerObject: any = {}
        for (const attr of attrsres) {
          if (attr.label.get() === 'id') Object.assign(customerObject, { id: attr.value.get() });
          else if (attr.label.get() === 'type') Object.assign(customerObject, { type: attr.value.get() });
          else if (attr.label.get() === 'name') Object.assign(customerObject, { name: attr.value.get() });
          else if (attr.label.get() === 'service') Object.assign(customerObject, { service: attr.value.get() });
        }
        Object.assign(customerObject, { contacts: arrayContact });
        return customerObject
      }
    }
  }

  public async linkCustomerToSite(requestBody: LinkParamCustomerToSite): Promise<void> {
    var foundCustomer: SpinalNode;
    var foundSite: SpinalNode;
    const customerContext = SpinalGraphService.getContext(CUSTOMER_LIST)
    const siteContext = SpinalGraphService.getContext(SITE_LIST)
    const customers = await customerContext.getChildren(
      MONITORING_SERVICE_CUSTOMER_RELATION_NAME
    );
    const sites = await siteContext.getChildren(
      MONITORING_SERVICE_SITE_RELATION_NAME
    );
    for (const customer of customers) {
      console.log(customer.getId().get());
      if (customer.getId().get() === requestBody.customerId) {
        foundCustomer = customer;
        // @ts-ignore
        SpinalGraphService._addNode(customer);
      }
    }
    for (const site of sites) {
      if (site.getId().get() === requestBody.siteId) {
        foundSite = site;
        // @ts-ignore
        SpinalGraphService._addNode(site);
      }
    }
    if (foundCustomer === undefined || foundSite === undefined) {
      throw new OperationError(
        'NOT_FOUND',
        HttpStatusCode.FORBIDDEN
      );
    }
    await SpinalGraphService.addChild(foundCustomer.getId().get(), foundSite.getId().get(), MONITORING_SERVICE_SITE_RELATION_NAME, MONITORING_SERVICE_RELATION_TYPE_PTR_LST)
  }
}


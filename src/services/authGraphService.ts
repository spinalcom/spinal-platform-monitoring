/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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
  SpinalGraph,
  SpinalContext,
} from 'spinal-env-viewer-graph-service';
import {
  PLATFORM_LIST,
  USER_LIST,
  APPLICATION_LIST,
  TOKEN_LIST,
  LOG_LIST,
  INFO_MONITORING,
  NOTIFICATION_LIST,
  SERVER_LIST,
  ORGAN_LIST,
  CUSTOMER_LIST,
  SITE_LIST,
  BUILDING_LIST,
  ORGAN_GROUP
} from '../constant';

export class AuthGraphService {
  public graph: SpinalGraph<any>;
  constructor(graph) {
    this.graph = graph;
  }
  async init(): Promise<SpinalGraph<any>> {
    let promises = [];
    var userList: SpinalContext<spinal.Model>;
    var platformList: SpinalContext<spinal.Model>;
    var tokenList: SpinalContext<spinal.Model>;
    var infoMonitoring: SpinalContext<spinal.Model>;
    var logs: SpinalContext<spinal.Model>;
    var notifications: SpinalContext<spinal.Model>;
    var serverList: SpinalContext<spinal.Model>;
    var organList: SpinalContext<spinal.Model>;
    var organGroup: SpinalContext<spinal.Model>;
    var customerList: SpinalContext<spinal.Model>;
    var siteList: SpinalContext<spinal.Model>;
    var buildingList: SpinalContext<spinal.Model>;





    if ((await this.graph.getContext(USER_LIST)) === undefined) {
      userList = new SpinalContext(USER_LIST);
      promises.push(this.graph.addContext(userList));
    }

    if ((await this.graph.getContext(SERVER_LIST)) === undefined) {
      serverList = new SpinalContext(SERVER_LIST);
      promises.push(this.graph.addContext(serverList));
    }

    if ((await this.graph.getContext(PLATFORM_LIST)) === undefined) {
      platformList = new SpinalContext(PLATFORM_LIST);
      promises.push(this.graph.addContext(platformList));
    }
    if ((await this.graph.getContext(TOKEN_LIST)) === undefined) {
      tokenList = new SpinalContext(TOKEN_LIST);
      promises.push(this.graph.addContext(tokenList));
    }

    if ((await this.graph.getContext(INFO_MONITORING)) === undefined) {
      infoMonitoring = new SpinalContext(INFO_MONITORING);
      promises.push(this.graph.addContext(infoMonitoring));
    }


    if ((await this.graph.getContext(LOG_LIST)) === undefined) {
      logs = new SpinalContext(LOG_LIST);
      promises.push(this.graph.addContext(logs));
    }

    if ((await this.graph.getContext(NOTIFICATION_LIST)) === undefined) {
      notifications = new SpinalContext(NOTIFICATION_LIST);
      promises.push(this.graph.addContext(notifications));
    }

    if ((await this.graph.getContext(ORGAN_LIST)) === undefined) {
      organList = new SpinalContext(ORGAN_LIST);
      promises.push(this.graph.addContext(organList));
    }

    if ((await this.graph.getContext(ORGAN_GROUP)) === undefined) {
      organGroup = new SpinalContext(ORGAN_GROUP);
      promises.push(this.graph.addContext(organGroup));
    }

    if ((await this.graph.getContext(CUSTOMER_LIST)) === undefined) {
      customerList = new SpinalContext(CUSTOMER_LIST);
      promises.push(this.graph.addContext(customerList));
    }
    if ((await this.graph.getContext(SITE_LIST)) === undefined) {
      siteList = new SpinalContext(SITE_LIST);
      promises.push(this.graph.addContext(siteList));
    }
    if ((await this.graph.getContext(BUILDING_LIST)) === undefined) {
      buildingList = new SpinalContext(BUILDING_LIST);
      promises.push(this.graph.addContext(buildingList));
    }


    return Promise.all(promises).then(() => {
      return this.graph;
    });
  }
}

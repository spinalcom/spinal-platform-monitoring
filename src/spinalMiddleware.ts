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

import { spinalCore, FileSystem, Model } from 'spinal-core-connectorjs_type';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { SpinalContext, SpinalGraph, SpinalNode } from 'spinal-model-graph';
import { store } from './utilities/utilitiesFunctions';

import config from './config';

class SpinalMiddleware {
  static instance: SpinalMiddleware = null;
  conn: spinal.FileSystem;

  static getInstance() {
    if (SpinalMiddleware.instance === null) {
      SpinalMiddleware.instance = new SpinalMiddleware();
    }
    return SpinalMiddleware.instance;
  }
  constructor() {
    // connection string to connect to spinalhub
    const connect_opt = `http://${config.spinalConnector.user}:${config.spinalConnector.password}@${config.spinalConnector.host}:${config.spinalConnector.port}/`;

    // initialize the connection
    this.conn = spinalCore.connect(connect_opt);
  }

  async init() {
    return new Promise<void>((resolve, reject) => {
      // get the Model from the spinalhub, "onLoadSuccess" and "onLoadError" are 2
      // callback function.
      spinalCore.load(
        this.conn,
        '/__users__/admin/MONITORING_config',
        this.onLoadSuccess.bind(this, resolve),
        this.onLoadError.bind(this, resolve, reject)
      );
    });
  }

  onLoadError(resolve, reject): void {
    const graph = new SpinalGraph();
    store(
      this.conn,
      graph,
      '/__users__/admin/MONITORING_config',
      () => {
        this.onLoadSuccess(resolve, graph);
      },
      () => {
        reject('IS NOT ABLE TO CONNECT TO HUB');
      }
    );
  }
  onLoadSuccess(resolve: () => void, graph: SpinalGraph<any>) {
    SpinalGraphService.setGraph(graph);
    resolve();
  }

  getGraph(): SpinalGraph<any> {
    return SpinalGraphService.getGraph();
  }
}
export default SpinalMiddleware;

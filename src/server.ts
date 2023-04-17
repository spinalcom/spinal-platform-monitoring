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
import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as _ from 'lodash';
import config from './config';
import path = require('path');
import * as methodOverride from 'method-override';
import { RegisterRoutes } from './routes';
import { Response as ExResponse, Request as ExRequest } from 'express';
import * as swaggerUi from 'swagger-ui-express';
const jsonFile = require('../build/swagger.json');
var history = require('connect-history-api-fallback');
/**
 *
 *
 * @return {*}  {express.Express}
 */
function Server(): express.Express {
  const app = express();

  // enable files upload
  app.use(
    fileUpload({
      createParentPath: true,
    })
  );
  app.use(morgan('tiny'));
  app.use(cors());
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  // app.use(methodOverride());
  app.use(history())

  // app.use('/static', express.static(path.join(__dirname, 'public')));

  //app.use('/docs', express.static(__dirname + '/swagger-ui'));

  //app.use('/api-docs', swaggerUi.serve);
  //app.get('/api-docs', swaggerUi.setup(jsonFile));
  //
  //app.use('/swagger.json', (req, res) => {
  //    res.sendFile(__dirname + '/swagger.json');
  //});
  RegisterRoutes(app);
  app.use(express.static(path.resolve(__dirname, '../vue-client/dist')));
  app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../vue-client/dist', "index.html"));
  });

  app.listen(config.api.port, () =>
    console.log(`app listening at http://localhost:${config.api.port} ....`)
  );


  return;
}
export default Server;

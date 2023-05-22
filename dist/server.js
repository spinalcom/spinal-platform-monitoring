"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const config_1 = require("./config");
const path = require("path");
const routes_1 = require("./routes");
const swaggerUi = require("swagger-ui-express");
const jsonFile = require('../build/swagger.json');
var history = require('connect-history-api-fallback');
/**
 *
 *
 * @return {*}  {express.Express}
 */
function Server() {
    const app = express();
    // enable files upload
    app.use(fileUpload({
        createParentPath: true,
    }));
    app.use(morgan('tiny'));
    app.use(cors());
    app.disable('x-powered-by');
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true,
    }));
    // app.use(methodOverride());
    app.use(history());
    app.use('/static', express.static(path.join(__dirname, 'public')));
    app.use('/docs', express.static(__dirname + '/swagger-ui'));
    app.use('/api-docs', swaggerUi.serve);
    app.get('/api-docs', swaggerUi.setup(jsonFile));
    app.use('/swagger.json', (req, res) => {
        res.sendFile(__dirname + '/swagger.json');
    });
    (0, routes_1.RegisterRoutes)(app);
    app.use(express.static(path.resolve(__dirname, '../vue-client/dist')));
    app.get('/', function (req, res) {
        res.sendFile(path.resolve(__dirname, '../vue-client/dist', "index.html"));
    });
    app.listen(config_1.default.api.port, () => console.log(`app listening at http://localhost:${config_1.default.api.port} ....`));
    return;
}
exports.default = Server;
//# sourceMappingURL=server.js.map
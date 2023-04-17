"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = void 0;
const jwt = require("jsonwebtoken");
function expressAuthentication(request, securityName, scopes) {
    if (securityName === 'jwt') {
        const token = request.body.token ||
            request.query.token ||
            request.headers['x-access-token'];
        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error('No token provided'));
            }
            jwt.verify(token, 'RANDOM_TOKEN_SECRET', function (err, decoded) {
                if (err) {
                    reject(err);
                }
                else {
                    //verify jwt
                    // Check if JWT contains all required scopes
                    for (let scope of scopes) {
                        if (!decoded.scopes.includes(scope)) {
                            reject(new Error('JWT does not contain required scope.'));
                        }
                    }
                    resolve(decoded);
                }
            });
        });
    }
}
exports.expressAuthentication = expressAuthentication;
//# sourceMappingURL=authentication.js.map
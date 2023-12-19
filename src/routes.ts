/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse, fetchMiddlewares } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BuildingController } from './building/buildingController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CustomerController } from './customer/customerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UsersController } from './monitoringUser/userController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OrgansController } from './organ/organController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HealthController } from './organHealth/healthController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PlatformsController } from './platform/platformController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RegisterKeyController } from './platform/registerKeyController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RegisterController } from './register/registerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ServersController } from './server/serverController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SiteController } from './site/siteController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TokensController } from './tokens/tokenController';
import { expressAuthentication } from './monitoringUser/authentication';
// @ts-ignore - no great way to install types from subpackage
const promiseAny = require('promise.any');
import type { RequestHandler, Router } from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "IBuilding": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "type": {"dataType":"string"},
            "name": {"dataType":"string"},
            "address": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBuildingCreationParams": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"string"},
            "name": {"dataType":"string"},
            "address": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LinkParamBuildingToPlatform": {
        "dataType": "refObject",
        "properties": {
            "buildingId": {"dataType":"string","required":true},
            "platformId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBuildingUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "address": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IContact": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string"},
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
            "email": {"dataType":"string"},
            "telephone": {"dataType":"string"},
            "category": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICustomer": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "type": {"dataType":"string"},
            "name": {"dataType":"string"},
            "service": {"dataType":"string"},
            "contacts": {"dataType":"array","array":{"dataType":"refObject","ref":"IContact"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IContactCreationParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
            "email": {"dataType":"string"},
            "telephone": {"dataType":"string"},
            "category": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICustomerCreationParams": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"string"},
            "name": {"dataType":"string"},
            "service": {"dataType":"string"},
            "contacts": {"dataType":"array","array":{"dataType":"refObject","ref":"IContactCreationParams"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAddPlatform": {
        "dataType": "refObject",
        "properties": {
            "customerId": {"dataType":"string","required":true},
            "platformId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LinkParamCustomerToSite": {
        "dataType": "refObject",
        "properties": {
            "customerId": {"dataType":"string","required":true},
            "siteId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IContactUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "email": {"dataType":"string"},
            "telephone": {"dataType":"string"},
            "category": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICustomerUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "service": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUser": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"double"}],"required":true},
            "type": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "userType": {"dataType":"string","required":true},
            "platformList": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserCreationParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "userType": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "platformList": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "email": {"dataType":"string"},
            "oldPassword": {"dataType":"string"},
            "newPassword": {"dataType":"string"},
            "userType": {"dataType":"string"},
            "platformList": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"string","required":true},"name":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserToken": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
            "token": {"dataType":"string"},
            "createdToken": {"dataType":"double"},
            "expieredToken": {"dataType":"double"},
            "userId": {"dataType":"string"},
            "userType": {"dataType":"string"},
            "userProfile": {"dataType":"string"},
            "serverId": {"dataType":"string"},
            "platformList": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"userProfile":{"dataType":"nestedObjectLiteral","nestedProperties":{"userProfileName":{"dataType":"string","required":true},"userProfileBosConfigId":{"dataType":"string","required":true},"userProfileAdminId":{"dataType":"string","required":true}},"required":true},"idPlatformOfAdmin":{"dataType":"string","required":true},"platformName":{"dataType":"string","required":true},"platformId":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserLoginParams": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserLogs": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "actor": {"dataType":"nestedObjectLiteral","nestedProperties":{"actorName":{"dataType":"string","required":true},"actorId":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IOrgan": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string"},
            "bosId": {"dataType":"string","required":true},
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
            "mac_adress": {"dataType":"string"},
            "ip_adress": {"dataType":"string"},
            "organType": {"dataType":"string"},
            "platformId": {"dataType":"string"},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IOrganCreationParams": {
        "dataType": "refObject",
        "properties": {
            "bosId": {"dataType":"string","required":true},
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
            "mac_adress": {"dataType":"string","required":true},
            "ip_adress": {"dataType":"string","required":true},
            "organType": {"dataType":"string"},
            "platformId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IOrganHub": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string"},
            "bosId": {"dataType":"string","required":true},
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
            "mac_adress": {"dataType":"string"},
            "ip_adress": {"dataType":"string"},
            "URL": {"dataType":"string","required":true},
            "port": {"dataType":"double","required":true},
            "login": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "organType": {"dataType":"string"},
            "platformId": {"dataType":"string"},
            "status": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPlatform": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "platformType": {"dataType":"string","required":true},
            "TokenBosRegister": {"dataType":"string"},
            "ipAdress": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
            "loginAdmin": {"dataType":"string","required":true},
            "passwordAdmin": {"dataType":"string","required":true},
            "hubOrgan": {"ref":"IOrganHub"},
            "organList": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"organName":{"dataType":"string","required":true},"organId":{"dataType":"string","required":true}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IRegisterKeyObject": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "value": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IOrganHubCreationParams": {
        "dataType": "refObject",
        "properties": {
            "bosId": {"dataType":"string","required":true},
            "name": {"dataType":"string"},
            "mac_adress": {"dataType":"string"},
            "ip_adress": {"dataType":"string"},
            "url": {"dataType":"string","required":true},
            "port": {"dataType":"double","required":true},
            "login": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "organType": {"dataType":"string"},
            "platformId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPlateformCreationParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "platformType": {"dataType":"string","required":true},
            "TokenBosRegister": {"dataType":"string"},
            "ipAdress": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
            "loginAdmin": {"dataType":"string","required":true},
            "passwordAdmin": {"dataType":"string","required":true},
            "hubOrgan": {"ref":"IOrganHubCreationParams","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IRegisterParams": {
        "dataType": "refObject",
        "properties": {
            "platformCreationParms": {"ref":"IPlateformCreationParams","required":true},
            "registerKey": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IServer": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "type": {"dataType":"string"},
            "name": {"dataType":"string"},
            "ipAdress": {"dataType":"string"},
            "macAdress": {"dataType":"string"},
            "sshLogin": {"dataType":"string"},
            "sshPassword": {"dataType":"string"},
            "boot_timestamp": {"dataType":"string"},
            "last_health_time": {"dataType":"string"},
            "serverType": {"dataType":"string"},
            "serverManagerId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISla": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string"},
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISite": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "type": {"dataType":"string"},
            "name": {"dataType":"string"},
            "address": {"dataType":"string"},
            "slas": {"dataType":"array","array":{"dataType":"refObject","ref":"ISla"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISlaCreationParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "type": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISiteCreationParams": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"string"},
            "name": {"dataType":"string"},
            "address": {"dataType":"string"},
            "slas": {"dataType":"array","array":{"dataType":"refObject","ref":"ISlaCreationParams"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LinkParamSiteToBuilding": {
        "dataType": "refObject",
        "properties": {
            "siteId": {"dataType":"string","required":true},
            "buildingId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISiteUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "address": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IToken": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "token": {"dataType":"string","required":true},
            "createdToken": {"dataType":"double"},
            "expieredToken": {"dataType":"double"},
            "userId": {"dataType":"string"},
            "userType": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.post('/buildings',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BuildingController)),
            ...(fetchMiddlewares<RequestHandler>(BuildingController.prototype.createBuilding)),

            function BuildingController_createBuilding(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IBuildingCreationParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new BuildingController();


              const promise = controller.createBuilding.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/buildings/linkBuildingToPlatform',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BuildingController)),
            ...(fetchMiddlewares<RequestHandler>(BuildingController.prototype.linkBuildingToPlatform)),

            function BuildingController_linkBuildingToPlatform(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LinkParamBuildingToPlatform"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new BuildingController();


              const promise = controller.linkBuildingToPlatform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/buildings/:buildingId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BuildingController)),
            ...(fetchMiddlewares<RequestHandler>(BuildingController.prototype.updateBuilding)),

            function BuildingController_updateBuilding(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IBuildingUpdateParams"},
                    buildingId: {"in":"path","name":"buildingId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new BuildingController();


              const promise = controller.updateBuilding.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/buildings',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BuildingController)),
            ...(fetchMiddlewares<RequestHandler>(BuildingController.prototype.getBuildings)),

            function BuildingController_getBuildings(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new BuildingController();


              const promise = controller.getBuildings.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/buildings/:buildingId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BuildingController)),
            ...(fetchMiddlewares<RequestHandler>(BuildingController.prototype.getBuilding)),

            function BuildingController_getBuilding(request: any, response: any, next: any) {
            const args = {
                    buildingId: {"in":"path","name":"buildingId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new BuildingController();


              const promise = controller.getBuilding.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/buildings/:buildingId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BuildingController)),
            ...(fetchMiddlewares<RequestHandler>(BuildingController.prototype.deleteBuilding)),

            function BuildingController_deleteBuilding(request: any, response: any, next: any) {
            const args = {
                    buildingId: {"in":"path","name":"buildingId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new BuildingController();


              const promise = controller.deleteBuilding.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/customers',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerController.prototype.createCustomer)),

            function CustomerController_createCustomer(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ICustomerCreationParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CustomerController();


              const promise = controller.createCustomer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/customers/addPlatform',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerController.prototype.addPlatform)),

            function CustomerController_addPlatform(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IAddPlatform"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CustomerController();


              const promise = controller.addPlatform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/customers/linkCustomerToSite',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerController.prototype.linkCustomerToSite)),

            function CustomerController_linkCustomerToSite(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LinkParamCustomerToSite"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CustomerController();


              const promise = controller.linkCustomerToSite.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/customers/:customerId/addContact',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerController.prototype.addContact)),

            function CustomerController_addContact(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IContactCreationParams"},
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CustomerController();


              const promise = controller.addContact.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/customers/:contactId/updateContact',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerController.prototype.updateContact)),

            function CustomerController_updateContact(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IContactUpdateParams"},
                    contactId: {"in":"path","name":"contactId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CustomerController();


              const promise = controller.updateContact.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/customers/:customerId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerController.prototype.updateCustomer)),

            function CustomerController_updateCustomer(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ICustomerUpdateParams"},
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CustomerController();


              const promise = controller.updateCustomer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/customers',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerController.prototype.getCustomers)),

            function CustomerController_getCustomers(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CustomerController();


              const promise = controller.getCustomers.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/customers/:customerId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerController.prototype.getCustomer)),

            function CustomerController_getCustomer(request: any, response: any, next: any) {
            const args = {
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CustomerController();


              const promise = controller.getCustomer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/customers/:customerId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerController.prototype.deleteCustomer)),

            function CustomerController_deleteCustomer(request: any, response: any, next: any) {
            const args = {
                    customerId: {"in":"path","name":"customerId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CustomerController();


              const promise = controller.deleteCustomer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/customers/:contactId/deleteContact',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CustomerController)),
            ...(fetchMiddlewares<RequestHandler>(CustomerController.prototype.deleteContact)),

            function CustomerController_deleteContact(request: any, response: any, next: any) {
            const args = {
                    contactId: {"in":"path","name":"contactId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new CustomerController();


              const promise = controller.deleteContact.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/users',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUsers)),

            function UsersController_getUsers(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.getUsers.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.createUser)),

            function UsersController_createUser(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IUserCreationParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.createUser.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/users/:userId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUser)),

            function UsersController_getUser(request: any, response: any, next: any) {
            const args = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.getUser.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/users/:userId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.deleteUser)),

            function UsersController_deleteUser(request: any, response: any, next: any) {
            const args = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.deleteUser.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/users/:userId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.updateUser)),

            function UsersController_updateUser(request: any, response: any, next: any) {
            const args = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IUserUpdateParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.updateUser.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/users',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.updateMonitoringAdmin)),

            function UsersController_updateMonitoringAdmin(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IUserUpdateParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.updateMonitoringAdmin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/getMonitoringAdmin',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getMonitoringAdmin)),

            function UsersController_getMonitoringAdmin(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.getMonitoringAdmin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/login',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.login)),

            function UsersController_login(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IUserLoginParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.login.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/loginMonitoringAdmin',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.loginMonitoringAdmin)),

            function UsersController_loginMonitoringAdmin(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IUserLoginParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.loginMonitoringAdmin.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/users/getRoles',
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getRoles)),

            function UsersController_getRoles(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.getRoles.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/users/:userId/userLogs',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UsersController)),
            ...(fetchMiddlewares<RequestHandler>(UsersController.prototype.getUserLogs)),

            function UsersController_getUserLogs(request: any, response: any, next: any) {
            const args = {
                    userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new UsersController();


              const promise = controller.getUserLogs.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/organs',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrgansController)),
            ...(fetchMiddlewares<RequestHandler>(OrgansController.prototype.createOrgan)),

            function OrgansController_createOrgan(request: any, response: any, next: any) {
            const args = {
                    test: {"in":"header","name":"x-access-token","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IOrganCreationParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrgansController();


              const promise = controller.createOrgan.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/organs',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrgansController)),
            ...(fetchMiddlewares<RequestHandler>(OrgansController.prototype.getOrgans)),

            function OrgansController_getOrgans(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrgansController();


              const promise = controller.getOrgans.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/organs/:organId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrgansController)),
            ...(fetchMiddlewares<RequestHandler>(OrgansController.prototype.getOrgan)),

            function OrgansController_getOrgan(request: any, response: any, next: any) {
            const args = {
                    organId: {"in":"path","name":"organId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrgansController();


              const promise = controller.getOrgan.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/organs/:organId/health/:begin/:end',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrgansController)),
            ...(fetchMiddlewares<RequestHandler>(OrgansController.prototype.getOrganHealth)),

            function OrgansController_getOrganHealth(request: any, response: any, next: any) {
            const args = {
                    test: {"in":"header","name":"x-access-token","required":true,"dataType":"string"},
                    organId: {"in":"path","name":"organId","required":true,"dataType":"string"},
                    begin: {"in":"path","name":"begin","required":true,"dataType":"double"},
                    end: {"in":"path","name":"end","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrgansController();


              const promise = controller.getOrganHealth.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/organs/:organId/reboot/:begin/:end',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrgansController)),
            ...(fetchMiddlewares<RequestHandler>(OrgansController.prototype.getOrganReboot)),

            function OrgansController_getOrganReboot(request: any, response: any, next: any) {
            const args = {
                    test: {"in":"header","name":"x-access-token","required":true,"dataType":"string"},
                    organId: {"in":"path","name":"organId","required":true,"dataType":"string"},
                    begin: {"in":"path","name":"begin","required":true,"dataType":"double"},
                    end: {"in":"path","name":"end","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrgansController();


              const promise = controller.getOrganReboot.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/organs/:organId/status/:begin/:end',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrgansController)),
            ...(fetchMiddlewares<RequestHandler>(OrgansController.prototype.getOrganStatus)),

            function OrgansController_getOrganStatus(request: any, response: any, next: any) {
            const args = {
                    test: {"in":"header","name":"x-access-token","required":true,"dataType":"string"},
                    organId: {"in":"path","name":"organId","required":true,"dataType":"string"},
                    begin: {"in":"path","name":"begin","required":true,"dataType":"double"},
                    end: {"in":"path","name":"end","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrgansController();


              const promise = controller.getOrganStatus.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/organs/:organId/ram/:begin/:end',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrgansController)),
            ...(fetchMiddlewares<RequestHandler>(OrgansController.prototype.getOrganRam)),

            function OrgansController_getOrganRam(request: any, response: any, next: any) {
            const args = {
                    test: {"in":"header","name":"x-access-token","required":true,"dataType":"string"},
                    organId: {"in":"path","name":"organId","required":true,"dataType":"string"},
                    begin: {"in":"path","name":"begin","required":true,"dataType":"double"},
                    end: {"in":"path","name":"end","required":true,"dataType":"double"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrgansController();


              const promise = controller.getOrganRam.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/organs/:organId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrgansController)),
            ...(fetchMiddlewares<RequestHandler>(OrgansController.prototype.updateOrgan)),

            function OrgansController_updateOrgan(request: any, response: any, next: any) {
            const args = {
                    organId: {"in":"path","name":"organId","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrgansController();


              const promise = controller.updateOrgan.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/organs/:organId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrgansController)),
            ...(fetchMiddlewares<RequestHandler>(OrgansController.prototype.deleteOrgan)),

            function OrgansController_deleteOrgan(request: any, response: any, next: any) {
            const args = {
                    organId: {"in":"path","name":"organId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new OrgansController();


              const promise = controller.deleteOrgan.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/health',
            ...(fetchMiddlewares<RequestHandler>(HealthController)),
            ...(fetchMiddlewares<RequestHandler>(HealthController.prototype.createHealth)),

            function HealthController_createHealth(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new HealthController();


              const promise = controller.createHealth.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/platforms',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.createPlateform)),

            function PlatformsController_createPlateform(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.createPlateform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/platforms',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.getPlatforms)),

            function PlatformsController_getPlatforms(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.getPlatforms.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/platforms/:platformId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.getPlateform)),

            function PlatformsController_getPlateform(request: any, response: any, next: any) {
            const args = {
                    platformId: {"in":"path","name":"platformId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.getPlateform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/platforms/:platformId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.deletePlatform)),

            function PlatformsController_deletePlatform(request: any, response: any, next: any) {
            const args = {
                    platformId: {"in":"path","name":"platformId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.deletePlatform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/platforms/:platformId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.updatePlateform)),

            function PlatformsController_updatePlateform(request: any, response: any, next: any) {
            const args = {
                    platformId: {"in":"path","name":"platformId","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.updatePlateform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/platforms/registerKey',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController)),
            ...(fetchMiddlewares<RequestHandler>(PlatformsController.prototype.updateRegisterKeyNode)),

            function PlatformsController_updateRegisterKeyNode(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new PlatformsController();


              const promise = controller.updateRegisterKeyNode.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/registerKey',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RegisterKeyController)),
            ...(fetchMiddlewares<RequestHandler>(RegisterKeyController.prototype.updateRegisterKeyNode)),

            function RegisterKeyController_updateRegisterKeyNode(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RegisterKeyController();


              const promise = controller.updateRegisterKeyNode.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/registerKey',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(RegisterKeyController)),
            ...(fetchMiddlewares<RequestHandler>(RegisterKeyController.prototype.getRegisterKeyNode)),

            function RegisterKeyController_getRegisterKeyNode(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RegisterKeyController();


              const promise = controller.getRegisterKeyNode.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/register',
            ...(fetchMiddlewares<RequestHandler>(RegisterController)),
            ...(fetchMiddlewares<RequestHandler>(RegisterController.prototype.registerPlatform)),

            function RegisterController_registerPlatform(request: any, response: any, next: any) {
            const args = {
                    object: {"in":"body","name":"object","required":true,"ref":"IRegisterParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RegisterController();


              const promise = controller.registerPlatform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/register/:platformId',
            ...(fetchMiddlewares<RequestHandler>(RegisterController)),
            ...(fetchMiddlewares<RequestHandler>(RegisterController.prototype.updatePlateform)),

            function RegisterController_updatePlateform(request: any, response: any, next: any) {
            const args = {
                    platformId: {"in":"path","name":"platformId","required":true,"dataType":"string"},
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new RegisterController();


              const promise = controller.updatePlateform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/servers',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ServersController)),
            ...(fetchMiddlewares<RequestHandler>(ServersController.prototype.createServer)),

            function ServersController_createServer(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ServersController();


              const promise = controller.createServer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/servers',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ServersController)),
            ...(fetchMiddlewares<RequestHandler>(ServersController.prototype.getServers)),

            function ServersController_getServers(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ServersController();


              const promise = controller.getServers.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/servers/:serverId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ServersController)),
            ...(fetchMiddlewares<RequestHandler>(ServersController.prototype.getServer)),

            function ServersController_getServer(request: any, response: any, next: any) {
            const args = {
                    serverId: {"in":"path","name":"serverId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ServersController();


              const promise = controller.getServer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/servers/:serverId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ServersController)),
            ...(fetchMiddlewares<RequestHandler>(ServersController.prototype.deleteServer)),

            function ServersController_deleteServer(request: any, response: any, next: any) {
            const args = {
                    serverId: {"in":"path","name":"serverId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ServersController();


              const promise = controller.deleteServer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/servers/pushDataServer',
            ...(fetchMiddlewares<RequestHandler>(ServersController)),
            ...(fetchMiddlewares<RequestHandler>(ServersController.prototype.pushDataServer)),

            function ServersController_pushDataServer(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new ServersController();


              const promise = controller.pushDataServer.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/sites',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SiteController)),
            ...(fetchMiddlewares<RequestHandler>(SiteController.prototype.createSite)),

            function SiteController_createSite(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ISiteCreationParams"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SiteController();


              const promise = controller.createSite.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/sites/addPlatform',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SiteController)),
            ...(fetchMiddlewares<RequestHandler>(SiteController.prototype.addPlatform)),

            function SiteController_addPlatform(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"IAddPlatform"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SiteController();


              const promise = controller.addPlatform.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/sites/linkSiteToBuilding',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SiteController)),
            ...(fetchMiddlewares<RequestHandler>(SiteController.prototype.linkSiteToBuilding)),

            function SiteController_linkSiteToBuilding(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LinkParamSiteToBuilding"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SiteController();


              const promise = controller.linkSiteToBuilding.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/sites/:siteId/addSla',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SiteController)),
            ...(fetchMiddlewares<RequestHandler>(SiteController.prototype.addSla)),

            function SiteController_addSla(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ISlaCreationParams"},
                    siteId: {"in":"path","name":"siteId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SiteController();


              const promise = controller.addSla.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/sites/:siteId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SiteController)),
            ...(fetchMiddlewares<RequestHandler>(SiteController.prototype.updateSite)),

            function SiteController_updateSite(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ISiteUpdateParams"},
                    siteId: {"in":"path","name":"siteId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SiteController();


              const promise = controller.updateSite.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, 201, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/sites',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SiteController)),
            ...(fetchMiddlewares<RequestHandler>(SiteController.prototype.getSites)),

            function SiteController_getSites(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SiteController();


              const promise = controller.getSites.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/sites/:siteId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SiteController)),
            ...(fetchMiddlewares<RequestHandler>(SiteController.prototype.getSite)),

            function SiteController_getSite(request: any, response: any, next: any) {
            const args = {
                    siteId: {"in":"path","name":"siteId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SiteController();


              const promise = controller.getSite.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/sites/:siteId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SiteController)),
            ...(fetchMiddlewares<RequestHandler>(SiteController.prototype.deleteSite)),

            function SiteController_deleteSite(request: any, response: any, next: any) {
            const args = {
                    siteId: {"in":"path","name":"siteId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new SiteController();


              const promise = controller.deleteSite.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/tokens',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TokensController)),
            ...(fetchMiddlewares<RequestHandler>(TokensController.prototype.getTokens)),

            function TokensController_getTokens(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TokensController();


              const promise = controller.getTokens.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/tokens/UserToken',
            ...(fetchMiddlewares<RequestHandler>(TokensController)),
            ...(fetchMiddlewares<RequestHandler>(TokensController.prototype.getUserTokens)),

            function TokensController_getUserTokens(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TokensController();


              const promise = controller.getUserTokens.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/tokens/ApplicationToken',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TokensController)),
            ...(fetchMiddlewares<RequestHandler>(TokensController.prototype.getApplicationTokens)),

            function TokensController_getApplicationTokens(request: any, response: any, next: any) {
            const args = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TokensController();


              const promise = controller.getApplicationTokens.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/tokens/getUserProfileByToken',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TokensController)),
            ...(fetchMiddlewares<RequestHandler>(TokensController.prototype.getUserProfileByToken)),

            function TokensController_getUserProfileByToken(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TokensController();


              const promise = controller.getUserProfileByToken.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/tokens/getAppProfileByToken',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(TokensController)),
            ...(fetchMiddlewares<RequestHandler>(TokensController.prototype.getAppProfileByToken)),

            function TokensController_getAppProfileByToken(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TokensController();


              const promise = controller.getAppProfileByToken.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/tokens/verifyToken',
            ...(fetchMiddlewares<RequestHandler>(TokensController)),
            ...(fetchMiddlewares<RequestHandler>(TokensController.prototype.verifyToken)),

            function TokensController_verifyToken(request: any, response: any, next: any) {
            const args = {
                    requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request, response);

                const controller = new TokensController();


              const promise = controller.verifyToken.apply(controller, validatedArgs as any);
              promiseHandler(controller, promise, response, undefined, next);
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, _response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthentication(request, name, secMethod[name])
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await promiseAny.call(Promise, secMethodOrPromises);
                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, successStatus: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus;
                let headers;
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders();
                    statusCode = controllerObj.getStatus() || statusCode;
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            response.status(statusCode || 200)
            data.pipe(response);
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        } else {
            response.status(statusCode || 204).end();
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown>  {
        return function(status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors  = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'queries':
                    return validationService.ValidateParam(args[key], request.query, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', {"noImplicitAdditionalProperties":"throw-on-extras"});
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    } else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
                    }
                case 'res':
                    return responder(response);
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

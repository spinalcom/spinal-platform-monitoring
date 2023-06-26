"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformsController = void 0;
const tsoa_1 = require("tsoa");
const platformServices_1 = require("./platformServices");
let PlatformsController = exports.PlatformsController = class PlatformsController extends tsoa_1.Controller {
    // @Security('jwt')
    // @SuccessResponse('201', 'Created') // Custom success response
    // @Post()
    // public async createPlateform(@Body() requestBody): Promise<any> {
    //   let platform = new PlatformService().createPlateform(requestBody);
    //   this.setStatus(201); // set return status 201rt
    //   return platform;
    // }
    /**
     *
     *
     * @return {*}  {Promise<IPlatform[]>}
     * @memberof PlatformsController
     */
    getPlatforms() {
        return __awaiter(this, void 0, void 0, function* () {
            return new platformServices_1.PlatformService().getPlateforms();
        });
    }
    getPlateform(platformId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201); // set return status 201
            return new platformServices_1.PlatformService().getPlateform(platformId);
        });
    }
    deletePlatform(platformId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new platformServices_1.PlatformService().deletePlatform(platformId);
        });
    }
    updatePlateform(platformId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return new platformServices_1.PlatformService().updatePlateform(platformId, requestBody);
        });
    }
    updateRegisterKeyNode() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201); // set return status 201
            return new platformServices_1.PlatformService().updateRegisterKeyNode();
        });
    }
};
__decorate([
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Post)()
], PlatformsController.prototype, "getPlatforms", null);
__decorate([
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Post)('{platformId}'),
    __param(0, (0, tsoa_1.Path)())
], PlatformsController.prototype, "getPlateform", null);
__decorate([
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Delete)('{platformId}'),
    __param(0, (0, tsoa_1.Path)())
], PlatformsController.prototype, "deletePlatform", null);
__decorate([
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Put)('{platformId}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)())
], PlatformsController.prototype, "updatePlateform", null);
__decorate([
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Post)('/registerKey')
], PlatformsController.prototype, "updateRegisterKeyNode", null);
exports.PlatformsController = PlatformsController = __decorate([
    (0, tsoa_1.Route)('platforms')
], PlatformsController);
//# sourceMappingURL=platformController.js.map
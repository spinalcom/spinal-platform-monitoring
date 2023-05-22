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
exports.UsersController = void 0;
const tsoa_1 = require("tsoa");
const userService_1 = require("./userService");
let UsersController = class UsersController extends tsoa_1.Controller {
    // @Security('jwt')
    createUser(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("controller", requestBody);
            let user = new userService_1.UserService().createUser(requestBody);
            this.setStatus(201); // set return status 201rt
            return user;
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201); // set return status 201
            return new userService_1.UserService().getUsers();
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201); // set return status 201
            return new userService_1.UserService().getUser(userId);
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new userService_1.UserService().deleteUser(userId);
        });
    }
    updateUser(userId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return new userService_1.UserService().updateUser(userId, requestBody);
        });
    }
    updateMonitoringAdmin(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return new userService_1.UserService().updateMonitoringAdmin(requestBody);
        });
    }
    // @Security('jwt')
    getMonitoringAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            return new userService_1.UserService().getMonitoringAdmin();
        });
    }
    userProfilesList() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201); // set return status 201
            return new userService_1.UserService().userProfilesList();
        });
    }
    login(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201); // set return status 201
            return new userService_1.UserService().login(requestBody);
        });
    }
    loginMonitoringAdmin(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201); // set return status 201
            return new userService_1.UserService().loginMonitoringAdmin(requestBody);
        });
    }
    // @Security("jwt")
    // @Get('/getInfoToken/{token}')
    // public async getInfoToken(@Path() token: string): Promise<IUserProfile> {
    //   this.setStatus(201); // set return status 201
    //   return new UserService().getInfoToken(token);
    // }
    // @Security("jwt")
    getRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201); // set return status 201
            return new userService_1.UserService().getRoles();
        });
    }
    getUserLogs(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new userService_1.UserService().getUserLogs(userId);
        });
    }
};
__decorate([
    (0, tsoa_1.SuccessResponse)('201', 'Created') // Custom success response
    ,
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)())
], UsersController.prototype, "createUser", null);
__decorate([
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Get)()
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Get)('{userId}'),
    __param(0, (0, tsoa_1.Path)())
], UsersController.prototype, "getUser", null);
__decorate([
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Delete)('{userId}'),
    __param(0, (0, tsoa_1.Path)())
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Put)('{userId}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)())
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Put)(),
    __param(0, (0, tsoa_1.Body)())
], UsersController.prototype, "updateMonitoringAdmin", null);
__decorate([
    (0, tsoa_1.Post)('/getMonitoringAdmin')
], UsersController.prototype, "getMonitoringAdmin", null);
__decorate([
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Post)('/userProfilesList')
], UsersController.prototype, "userProfilesList", null);
__decorate([
    (0, tsoa_1.Post)('/login'),
    __param(0, (0, tsoa_1.Body)())
], UsersController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Post)('/loginMonitoringAdmin'),
    __param(0, (0, tsoa_1.Body)())
], UsersController.prototype, "loginMonitoringAdmin", null);
__decorate([
    (0, tsoa_1.Post)('/getRoles')
], UsersController.prototype, "getRoles", null);
__decorate([
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Get)('{userId}/userLogs'),
    __param(0, (0, tsoa_1.Path)())
], UsersController.prototype, "getUserLogs", null);
UsersController = __decorate([
    (0, tsoa_1.Route)('users')
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=userController.js.map
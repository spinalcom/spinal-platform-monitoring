"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.INFO_ADMIN = exports.TOKEN_LIST = exports.APPLICATION_LIST = exports.USER_LIST = exports.PLATFORM_LIST = exports.MONITORING_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME = exports.MONITORING_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME = exports.MONITORING_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME = exports.MONITORING_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME = exports.MONITORING_SERVICE_LOG_USER_EVENT_RELATION_NAME = exports.MONITORING_SERVICE_LOG_CATEGORY_RELATION_NAME = exports.MONITORING_SERVICE_LOG_RELATION_NAME = exports.MONITORING_SERVICE_INFO_ADMIN_RELATION_NAME = exports.MONITORING_SERVICE_TOKEN_CATEGORY_RELATION_NAME = exports.MONITORING_SERVICE_TOKEN_RELATION_NAME = exports.MONITORING_SERVICE_APPLICATION_RELATION_NAME = exports.MONITORING_SERVICE_USER_RELATION_NAME = exports.MONITORING_SERVICE_APP_PROFILE_RELATION_NAME = exports.MONITORING_SERVICE_USER_PROFILE_RELATION_NAME = exports.MONITORING_SERVICE_ORGAN_RELATION_NAME = exports.MONITORING_SERVICE_NOTIFICATION_RELATION_NAME = exports.MONITORING_SERVICE_PLATFORM_RELATION_NAME = exports.USER_LOG_TYPE = exports.ADMIN_REQUEST_EVENT_LOG_TYPE = exports.PLATFORM_REQUEST_EVENT_LOG_TYPE = exports.APPLICATION_REQUEST_EVENT_LOG_TYPE = exports.USER_REQUEST_EVENT_LOG_TYPE = exports.ADMIN_LOG_EVENT_TYPE = exports.PLATFORM_LOG_EVENT_TYPE = exports.APPLICATION_LOG_EVENT_TYPE = exports.USER_LOG_EVENT_TYPE = exports.ADMIN_LOG_CATEGORY_TYPE = exports.PLATFORM_LOG_CATEGORY_TYPE = exports.APPLICATION_LOG_CATEGORY_TYPE = exports.USER_LOG_CATEGORY_TYPE = exports.LOG_TYPE = exports.REGISTER_KEY_TYPE = exports.INFO_ADMIN_TYPE = exports.TOKEN_TYPE = exports.APP_PROFILE_TYPE = exports.USER_PROFILE_TYPE = exports.ORGAN_TYPE = exports.PLATFORM_TYPE = exports.APPLICATION_TOKEN_CATEGORY_TYPE = exports.APPLICATION_TYPE = exports.USER_TOKEN_CATEGORY_TYPE = exports.NOTIFICATION_TYPE = exports.USER_TYPE = exports.MONITORING_SERVICE_RELATION_TYPE_LST_PTR = exports.MONITORING_SERVICE_RELATION_TYPE_PTR_LST = void 0;
exports.NOTIFICATION_LIST = exports.LOG_LIST = void 0;
// Type
exports.MONITORING_SERVICE_RELATION_TYPE_PTR_LST = 'PtrLst';
exports.MONITORING_SERVICE_RELATION_TYPE_LST_PTR = 'LstPtr';
exports.USER_TYPE = 'MonitoringServiceUser';
exports.NOTIFICATION_TYPE = 'MonitoringServiceNotification';
exports.USER_TOKEN_CATEGORY_TYPE = 'MonitoringServiceUserCategory';
exports.APPLICATION_TYPE = 'MonitoringServiceApplication';
exports.APPLICATION_TOKEN_CATEGORY_TYPE = 'MonitoringServiceApplicationCategory';
exports.PLATFORM_TYPE = 'MonitoringServicePlatform';
exports.ORGAN_TYPE = 'MonitoringServiceOrgan';
exports.USER_PROFILE_TYPE = 'MonitoringServiceUserProfile';
exports.APP_PROFILE_TYPE = 'MonitoringServiceAPPProfile';
exports.TOKEN_TYPE = 'MonitoringServiceToken';
exports.INFO_ADMIN_TYPE = 'MonitoringServiceInfoAdmin';
exports.REGISTER_KEY_TYPE = 'MonitoringServiceRegisterKey';
exports.LOG_TYPE = 'MonitoringServiceLogs';
exports.USER_LOG_CATEGORY_TYPE = 'MonitoringServiceUserLogCategory';
exports.APPLICATION_LOG_CATEGORY_TYPE = 'MonitoringServiceApplicationLogCategory';
exports.PLATFORM_LOG_CATEGORY_TYPE = 'MonitoringServicePlatformLogCategory';
exports.ADMIN_LOG_CATEGORY_TYPE = 'MonitoringServiceAdminLogCategory';
exports.USER_LOG_EVENT_TYPE = 'MonitoringServiceUserEvent';
exports.APPLICATION_LOG_EVENT_TYPE = 'MonitoringServiceApplicationEvent';
exports.PLATFORM_LOG_EVENT_TYPE = 'MonitoringServicePlatformEvent';
exports.ADMIN_LOG_EVENT_TYPE = 'MonitoringServiceAdminEvent';
exports.USER_REQUEST_EVENT_LOG_TYPE = 'MonitoringServiceUserRequestEventLog';
exports.APPLICATION_REQUEST_EVENT_LOG_TYPE = 'MonitoringServiceApplicationRequestEventLog';
exports.PLATFORM_REQUEST_EVENT_LOG_TYPE = 'MonitoringServicePlatformRequestEventLog';
exports.ADMIN_REQUEST_EVENT_LOG_TYPE = 'MonitoringServiceAdminRequestEventLog';
exports.USER_LOG_TYPE = 'MonitoringServiceUserLog';
// RelationName
exports.MONITORING_SERVICE_PLATFORM_RELATION_NAME = 'HasPlatform';
exports.MONITORING_SERVICE_NOTIFICATION_RELATION_NAME = 'HasNotification';
exports.MONITORING_SERVICE_ORGAN_RELATION_NAME = 'HasOrgan';
exports.MONITORING_SERVICE_USER_PROFILE_RELATION_NAME = 'HasUserProfile';
exports.MONITORING_SERVICE_APP_PROFILE_RELATION_NAME = 'HasAppProfile';
exports.MONITORING_SERVICE_USER_RELATION_NAME = 'HasUser';
exports.MONITORING_SERVICE_APPLICATION_RELATION_NAME = 'HasApplication';
exports.MONITORING_SERVICE_TOKEN_RELATION_NAME = 'HasToken';
exports.MONITORING_SERVICE_TOKEN_CATEGORY_RELATION_NAME = 'HasCategoryToken';
exports.MONITORING_SERVICE_INFO_ADMIN_RELATION_NAME = 'HasRegisterKey';
exports.MONITORING_SERVICE_LOG_RELATION_NAME = 'HasLog';
exports.MONITORING_SERVICE_LOG_CATEGORY_RELATION_NAME = 'HasCategoryLog';
exports.MONITORING_SERVICE_LOG_USER_EVENT_RELATION_NAME = 'HasEventLog';
exports.MONITORING_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME = 'HasEventLog';
exports.MONITORING_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME = 'HasEventLog';
exports.MONITORING_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME = 'HasEventLog';
exports.MONITORING_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME = 'HasRequestEventLog';
//ContextName
exports.PLATFORM_LIST = 'platformList';
exports.USER_LIST = 'userList';
exports.APPLICATION_LIST = 'applicationList';
exports.TOKEN_LIST = 'tokenList';
exports.INFO_ADMIN = 'infoAdmin';
exports.LOG_LIST = 'logList';
exports.NOTIFICATION_LIST = 'notificationList';
//# sourceMappingURL=constant.js.map
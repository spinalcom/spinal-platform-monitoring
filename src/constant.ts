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

// Type
export const AUTH_SERVICE_RELATION_TYPE_PTR_LST = 'PtrLst';
export const AUTH_SERVICE_RELATION_TYPE_LST_PTR = 'LstPtr';
export const USER_TYPE = 'AuthServiceUser';
export const NOTIFICATION_TYPE = 'AuthServiceNotification';
export const USER_TOKEN_CATEGORY_TYPE = 'AuthServiceUserCategory';
export const APPLICATION_TYPE = 'AuthServiceApplication';
export const APPLICATION_TOKEN_CATEGORY_TYPE = 'AuthServiceApplicationCategory';
export const PLATFORM_TYPE = 'AuthServicePlatform';
export const ORGAN_TYPE = 'AuthServiceOrgan';
export const USER_PROFILE_TYPE = 'AuthServiceUserProfile';
export const APP_PROFILE_TYPE = 'AuthServiceAPPProfile';
export const TOKEN_TYPE = 'AuthServiceToken';
export const INFO_ADMIN_TYPE = 'AuthServiceInfoAdmin';
export const REGISTER_KEY_TYPE = 'AuthServiceRegisterKey';
export const LOG_TYPE = 'AuthServiceLogs'
export const USER_LOG_CATEGORY_TYPE = 'AuthServiceUserLogCategory'
export const APPLICATION_LOG_CATEGORY_TYPE = 'AuthServiceApplicationLogCategory'
export const PLATFORM_LOG_CATEGORY_TYPE = 'AuthServicePlatformLogCategory'
export const ADMIN_LOG_CATEGORY_TYPE = 'AuthServiceAdminLogCategory'
export const USER_LOG_EVENT_TYPE = 'AuthServiceUserEvent'
export const APPLICATION_LOG_EVENT_TYPE = 'AuthServiceApplicationEvent'
export const PLATFORM_LOG_EVENT_TYPE = 'AuthServicePlatformEvent'
export const ADMIN_LOG_EVENT_TYPE = 'AuthServiceAdminEvent'
export const USER_REQUEST_EVENT_LOG_TYPE = 'AuthServiceUserRequestEventLog'
export const APPLICATION_REQUEST_EVENT_LOG_TYPE = 'AuthServiceApplicationRequestEventLog'
export const PLATFORM_REQUEST_EVENT_LOG_TYPE = 'AuthServicePlatformRequestEventLog'
export const ADMIN_REQUEST_EVENT_LOG_TYPE = 'AuthServiceAdminRequestEventLog'

export const USER_LOG_TYPE = 'AuthServiceUserLog'

// RelationName
export const AUTH_SERVICE_PLATFORM_RELATION_NAME = 'HasPlatform';
export const AUTH_SERVICE_NOTIFICATION_RELATION_NAME = 'HasNotification';
export const AUTH_SERVICE_ORGAN_RELATION_NAME = 'HasOrgan';
export const AUTH_SERVICE_USER_PROFILE_RELATION_NAME = 'HasUserProfile';
export const AUTH_SERVICE_APP_PROFILE_RELATION_NAME = 'HasAppProfile';
export const AUTH_SERVICE_USER_RELATION_NAME = 'HasUser';
export const AUTH_SERVICE_APPLICATION_RELATION_NAME = 'HasApplication';
export const AUTH_SERVICE_TOKEN_RELATION_NAME = 'HasToken';
export const AUTH_SERVICE_TOKEN_CATEGORY_RELATION_NAME = 'HasCategoryToken';
export const AUTH_SERVICE_INFO_ADMIN_RELATION_NAME = 'HasRegisterKey';
export const AUTH_SERVICE_LOG_RELATION_NAME = 'HasLog';
export const AUTH_SERVICE_LOG_CATEGORY_RELATION_NAME = 'HasCategoryLog';
export const AUTH_SERVICE_LOG_USER_EVENT_RELATION_NAME = 'HasEventLog';
export const AUTH_SERVICE_LOG_APPLICATION_EVENT_RELATION_NAME = 'HasEventLog';
export const AUTH_SERVICE_LOG_PLATFORM_EVENT_RELATION_NAME = 'HasEventLog';
export const AUTH_SERVICE_LOG_ADMIN_EVENT_RELATION_NAME = 'HasEventLog';
export const AUTH_SERVICE_LOG_REQUEST_EVENT_RELATION_NAME = 'HasRequestEventLog'




//ContextName
export const PLATFORM_LIST = 'platformList';
export const USER_LIST = 'userList';
export const APPLICATION_LIST = 'applicationList';
export const TOKEN_LIST = 'tokenList';
export const INFO_ADMIN = 'infoAdmin';
export const LOG_LIST = 'logList';
export const NOTIFICATION_LIST = 'notificationList'

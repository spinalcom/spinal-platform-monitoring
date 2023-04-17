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

interface IConfigBos {
  userProfileList: IUserProfileListItem[];
  appProfileList: IAppProfileListItem[];
  organList: IOrganListItem[];
}
interface IUserProfileListItem {
  id: string;
  label: string;
}
interface IAppProfileListItem {
  id: string;
  label: string;
}
interface IOrganListItem {
  label: string;
  type: string;
}

export const data = {
  userProfileList: [
    { id: '12345', label: 'userprofile1' },
    { id: '00001', label: 'userprofile2' },
    { id: '86455', label: 'userprofile3' },
  ],
  appProfileList: [
    { id: '47588', label: 'approfile1' },
    { id: '08755', label: 'approfile2' },
    { id: '123457', label: 'approfile3' },
  ],
  organList: [
    { label: 'dump manager', type: 'utilities' },
    { label: 'Forge connector', type: 'connector' },
    { label: 'bacnetIP connector', type: 'connector' },
    { label: 'Analytics', type: 'analytics' },
    { label: 'Export analytics', type: 'analytics' },
    { label: 'Mission', type: 'connector' },
    { label: 'API & APP serveur', type: 'graph api' },
  ],
};

export const result = {
  URLBos: 'url',
  TokenBosAdmin: 'TokenBosAdmin',
  TokenAdminBos: 'TokenAdminBos',
  platformId: 'ddd',
  jsonData: data,
};

// {
//   "URLBos": "url",
//   "TokenBosAdmin": "TokenBosAdmin",
//   "TokenAdminBos": "TokenAdminBos",
//   "platformId": "ddd",
//   "jsonData": {
//   "userProfileList": [
//     { "id": "12345", "label": "userprofile1" },
//     { "id": "00001", "label": "userprofile2" },
//     { "id": "86455", "label": "userprofile3" }
//   ],
//   "appProfileList": [
//     { "id": "47588", "label": "approfile1" },
//     { "id": "08755", "label": "approfile2" },
//     { "id": "123457", "label": "approfile3" }
//   ],
//   "organList": [
//     { "label": "dump manager", "type": "utilities" },
//     { "label": "Forge connector", "type": "connector" },
//     { "label": "bacnetIP connector", "type": "connector" },
//     { "label": "Analytics", "type": "analytics" },
//     { "label": "Export analytics", "type": "analytics" },
//     { "label": "Mission", "type": "connector" },
//     { "label": "API & APP serveur", "type": "graph api" }
//   ]
// }
// }

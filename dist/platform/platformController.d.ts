import { Controller } from 'tsoa';
import { IPlatform, IPlatformUpdateParams, IRegisterKeyObject, IPlatformLogs } from './platform.model';
import { IUserProfile } from './userProfile.model';
import { IAppProfile } from './appProfile.model';
export declare class PlatformsController extends Controller {
    createPlateform(requestBody: any): Promise<any>;
    getPlatforms(): Promise<IPlatform[]>;
    getPlateform(platformId: string): Promise<IPlatform>;
    deletePlatform(platformId: string): Promise<void>;
    updatePlateform(platformId: string, requestBody: IPlatformUpdateParams): Promise<IPlatform>;
    getUserProfileList(platformId: string): Promise<IUserProfile[]>;
    getAppProfileService(platformId: string): Promise<IAppProfile[]>;
    getPlatformLogs(platformId: string): Promise<IPlatformLogs[]>;
    updateRegisterKeyNode(): Promise<IRegisterKeyObject>;
}

import { Controller } from 'tsoa';
import { IPlatform, IRegisterKeyObject } from './platform.model';
export declare class PlatformsController extends Controller {
    /**
     *
     *
     * @return {*}  {Promise<IPlatform[]>}
     * @memberof PlatformsController
     */
    getPlatforms(): Promise<IPlatform[]>;
    getPlateform(platformId: string): Promise<IPlatform>;
    deletePlatform(platformId: string): Promise<void>;
    updatePlateform(platformId: string, requestBody: any): Promise<IPlatform>;
    updateRegisterKeyNode(): Promise<IRegisterKeyObject>;
}

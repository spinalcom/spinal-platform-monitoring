import { SpinalGraph } from 'spinal-env-viewer-graph-service';
import { IPlatform, IPlateformCreationParams, IPlatformUpdateParams, IRegisterParams, IRegisterKeyObject, IPlatformLogs } from './platform.model';
import SpinalMiddleware from '../spinalMiddleware';
/**
 *
 *
 * @export
 * @class PlatformService
 */
export declare class PlatformService {
    spinalMiddleware: SpinalMiddleware;
    graph: SpinalGraph<any>;
    constructor();
    createPlateform(platformCreationParms: IPlateformCreationParams): Promise<IPlatform>;
    getPlateform(id: any): Promise<IPlatform>;
    getPlateforms(): Promise<IPlatform[]>;
    updatePlateform(id: string, requestBody: IPlatformUpdateParams): Promise<IPlatform>;
    deletePlatform(id: string): Promise<void>;
    createRegisterKeyNode(): Promise<IRegisterKeyObject>;
    generateRegisterKey(): any;
    updateRegisterKeyNode(): Promise<IRegisterKeyObject>;
    getRegisterKeyNode(): Promise<IRegisterKeyObject>;
    generateTokenBosAdmin(platformName: string): string;
    registerNewPlatform(object: IRegisterParams): Promise<IPlatform | string>;
    updateNewPlatform(updateParams: any): Promise<void>;
    getPlateformLogs(id: string): Promise<IPlatformLogs[]>;
}

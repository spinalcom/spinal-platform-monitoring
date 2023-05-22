import { Controller } from 'tsoa';
import { IPlateformCreationParams } from '../platform/platform.model';
interface IRegisterParams {
    platformCreationParms: IPlateformCreationParams;
    registerKey: string;
}
export declare class RegisterController extends Controller {
    registerPlatform(object: IRegisterParams): Promise<any>;
    updatePlatform(object: any): Promise<any>;
}
export {};

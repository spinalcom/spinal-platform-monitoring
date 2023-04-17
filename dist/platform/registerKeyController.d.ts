import { Controller } from 'tsoa';
import { IRegisterKeyObject } from './platform.model';
export declare class RegisterKeyController extends Controller {
    updateRegisterKeyNode(): Promise<IRegisterKeyObject>;
    getRegisterKeyNode(): Promise<IRegisterKeyObject>;
}

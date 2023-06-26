import { Controller } from 'tsoa';
import { IOrgan } from './organ.model';
export declare class OrgansController extends Controller {
    getOrgans(): Promise<IOrgan[]>;
    updatePlateform(organId: string): Promise<void>;
}

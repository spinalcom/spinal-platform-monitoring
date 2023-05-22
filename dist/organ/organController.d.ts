import { Controller } from 'tsoa';
import { IOrganCreationParams, IOrganUpdateParams, IOrgan } from './organ.model';
export declare class OrgansController extends Controller {
    createOrgan(requestBody: IOrganCreationParams): Promise<IOrgan>;
    getOrgans(platformId: string): Promise<IOrgan[]>;
    updatePlateform(organId: string, requestBody: IOrganUpdateParams): Promise<IOrgan>;
}

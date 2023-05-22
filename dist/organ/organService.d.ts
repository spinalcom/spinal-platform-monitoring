import { SpinalGraph } from 'spinal-env-viewer-graph-service';
import { IOrganCreationParams, IOrganUpdateParams, IOrgan } from './organ.model';
import SpinalMiddleware from '../spinalMiddleware';
export declare class OrganService {
    spinalMiddleware: SpinalMiddleware;
    graph: SpinalGraph<any>;
    constructor();
    createOrgan(organCreationParms: IOrganCreationParams): Promise<IOrgan>;
    getOrgans(platformId: string): Promise<IOrgan[]>;
    getOrgan(platformId: string, organId: string): Promise<IOrgan>;
    updateOrgan(organId: string, requestBody: IOrganUpdateParams): Promise<IOrgan>;
    deleteOrgan(platformId: string, organId: string): Promise<void>;
}

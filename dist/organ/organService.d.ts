import { SpinalGraph } from 'spinal-env-viewer-graph-service';
import { IOrganCreationParams, IOrgan } from './organ.model';
import SpinalMiddleware from '../spinalMiddleware';
export declare class OrganService {
    spinalMiddleware: SpinalMiddleware;
    graph: SpinalGraph<any>;
    constructor();
    createOrgan(organCreationParms: IOrganCreationParams): Promise<IOrgan>;
    getOrgans(): Promise<IOrgan[]>;
    deleteOrgan(organId: string): Promise<void>;
}

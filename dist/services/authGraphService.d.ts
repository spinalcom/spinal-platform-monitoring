import { SpinalGraph } from 'spinal-env-viewer-graph-service';
export declare class AuthGraphService {
    graph: SpinalGraph<any>;
    constructor(graph: any);
    init(): Promise<SpinalGraph<any>>;
}

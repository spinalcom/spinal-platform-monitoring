import { SpinalGraph } from 'spinal-model-graph';
declare class SpinalMiddleware {
    static instance: SpinalMiddleware;
    conn: spinal.FileSystem;
    static getInstance(): SpinalMiddleware;
    constructor();
    init(): Promise<void>;
    onLoadError(resolve: any, reject: any): void;
    onLoadSuccess(resolve: () => void, graph: SpinalGraph<any>): void;
    getGraph(): SpinalGraph<any>;
}
export default SpinalMiddleware;

import { SpinalGraph } from 'spinal-env-viewer-graph-service';
import SpinalMiddleware from '../spinalMiddleware';
export declare class TokensService {
    spinalMiddleware: SpinalMiddleware;
    graph: SpinalGraph<any>;
    constructor();
    createTokenTree(): Promise<void>;
    verify(): Promise<void>;
    getTokens(): Promise<any[]>;
    getUserTokens(): Promise<any[]>;
    getApplicationTokens(): Promise<any[]>;
    getUserProfileByToken(Token: string, platformId: string): Promise<{
        token: string;
        platformId: string;
        userProfileName: any;
        userProfileBosConfigId: any;
    }>;
    getAppProfileByToken(Token: string, platformId: string): Promise<{
        token: string;
        platformId: string;
        appProfileName: any;
        appProfileBosConfigId: any;
    }>;
    verifyToken(tokenParam: string, actor: string): Promise<{
        token: any;
        createdToken: any;
        expieredToken: any;
        status: string;
    }>;
}

import { SpinalGraph } from 'spinal-env-viewer-graph-service';
import { IUserProfileCreationParams, IUserProfile } from './userProfile.model';
import { IAppProfileCreationParams, IAppProfile } from './appProfile.model';
import SpinalMiddleware from '../spinalMiddleware';
export declare class ProfileServices {
    spinalMiddleware: SpinalMiddleware;
    graph: SpinalGraph<any>;
    constructor();
    createUserProfileService(userProfileCreationParms: IUserProfileCreationParams): Promise<IUserProfile>;
    createAppProfileService(appProfileCreationParms: IAppProfileCreationParams): Promise<IAppProfile>;
    getUserProfileService(platformId: string): Promise<IUserProfile[]>;
    getAppProfileService(platformId: string): Promise<IAppProfile[]>;
}

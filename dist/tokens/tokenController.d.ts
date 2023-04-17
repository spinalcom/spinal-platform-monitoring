import { Controller } from 'tsoa';
import { IToken } from './token.model';
export declare class TokensController extends Controller {
    getTokens(): Promise<IToken[]>;
    getUserTokens(): Promise<IToken[]>;
    getApplicationTokens(): Promise<IToken[]>;
    getUserProfileByToken(requestBody: any): Promise<any>;
    getAppProfileByToken(requestBody: any): Promise<any>;
    verifyToken(requestBody: any): Promise<any>;
}

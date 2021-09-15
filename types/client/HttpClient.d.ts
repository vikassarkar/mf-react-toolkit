import { HttpService } from './HttpService';
export declare class HttpClient {
    configs: any;
    rest: HttpService;
    constructor(configs: any, store: any, storeInstance: any);
    get(mockName: string, url: string, query: object, customHeaders?: object): any;
    post(mockName: string, url: string, payload?: any, query?: object, customHeaders?: object): any;
    put(mockName: string, url: string, payload?: any, query?: object, customHeaders?: object): any;
    patch(mockName: string, url: string, payload?: any, query?: object, customHeaders?: object): any;
    delete(mockName: string, url: string, payload?: any, query?: object, customHeaders?: object): any;
}

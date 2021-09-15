export declare class HttpService {
    isMock: any;
    axios: any;
    baseAction: any;
    baseURL: any;
    envConfigs: any;
    mockURL: any;
    headerConfigs: any;
    localConfigs: any;
    store: any;
    storeInstance: any;
    notificationAction: any;
    queriedUrl: string;
    constructor(headerConfigs: any, localConfigs: any, envConfigs: any, axios: any, store: any, storeInstance: any);
    getCustomHeaders(customHeaders: object): any;
    getHeaders(customHeaders: object): any;
    http(method: string, mockName: string, url: string, payload: any, query: object, customHeaders: object): any;
    loaderAction(): void;
    mockService(mockName: string, customHeaders: object): any;
    apiService(method: string, url: string, payload: any, query: object, customHeaders: object, attempt?: number): any;
    getCallOptions(method: string, url: string, payload: any, query: object, customHeaders: object): {
        method: string;
        url: string;
        headers: any;
        data?: undefined;
    } | {
        method: string;
        url: string;
        data: any;
        headers: any;
    };
}

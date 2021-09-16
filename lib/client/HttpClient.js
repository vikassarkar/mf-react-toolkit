"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const HttpService_1 = require("./HttpService");
class HttpClient {
    constructor(configs, store, storeInstance) {
        this.configs = configs;
        const { headerConfigs, localConfigs, envConfigs } = configs;
        this.rest = new HttpService_1.HttpService(headerConfigs, localConfigs, envConfigs, axios_1.default, store, storeInstance);
    }
    get(mockName, url, query, customHeaders = {}) {
        return this.rest.http('get', mockName, url, '', query, customHeaders);
    }
    post(mockName, url, payload = {}, query = {}, customHeaders = {}) {
        return this.rest.http('post', mockName, url, payload, query, customHeaders);
    }
    put(mockName, url, payload = {}, query = {}, customHeaders = {}) {
        return this.rest.http('put', mockName, url, payload, query, customHeaders);
    }
    patch(mockName, url, payload = {}, query = {}, customHeaders = {}) {
        return this.rest.http('patch', mockName, url, payload, query, customHeaders);
    }
    delete(mockName, url, payload = {}, query = {}, customHeaders = {}) {
        return this.rest.http('delete', mockName, url, payload, query, customHeaders);
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=HttpClient.js.map
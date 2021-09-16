"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoragePersistance = void 0;
class StoragePersistance {
    constructor(key, persist) {
        this.key = key;
        this.persist = persist;
        this.sessionStorage = window.sessionStorage;
        this._init();
    }
    getStorage() {
        const jsonState = this.sessionStorage.getItem(this.key) || '';
        return JSON.parse(jsonState);
    }
    setStorage(state) {
        const jsonState = JSON.stringify(state);
        this.sessionStorage.setItem(this.key, jsonState);
    }
    persistStorage(slice, sliceNewData, persistStore) {
        if (persistStore && this.persist) {
            const { whitelist } = persistStore;
            const jsonState = this.sessionStorage.getItem(this.key) || '';
            const sessionData = JSON.parse(jsonState);
            const whiteListData = this.whitelistStoreSlice(whitelist, sliceNewData) || {};
            sessionData[slice] = Object.assign({}, whiteListData);
            this.setStorage(sessionData);
        }
    }
    whitelistStoreSlice(whitelistArr, sliceNewData) {
        if (whitelistArr && Array.isArray(whitelistArr)) {
            const sliceWhitelist = {};
            whitelistArr.forEach((key) => {
                sliceWhitelist[key] = sliceNewData[key];
            });
            return sliceWhitelist;
        }
        return {};
    }
    _init() {
        const jsonState = this.sessionStorage.getItem(this.key);
        const isSessionDataDefined = jsonState && Object.keys(jsonState).length >= 0;
        if (this.persist && !isSessionDataDefined) {
            this.sessionStorage.setItem(this.key, JSON.stringify({}));
        }
    }
}
exports.StoragePersistance = StoragePersistance;
//# sourceMappingURL=StorePersistance.js.map
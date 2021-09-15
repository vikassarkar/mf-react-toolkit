export class StoragePersistance {
    key: string;
    persist: boolean;
    sessionStorage: Storage;
    constructor(key: string, persist: boolean) {
        this.key = key;
        this.persist = persist;
        this.sessionStorage = window.sessionStorage;
        this._init();
    }

    getStorage() {
        const jsonState = this.sessionStorage.getItem(this.key) || '';
        return JSON.parse(jsonState);
    }

    setStorage(state: any) {
        const jsonState = JSON.stringify(state);
        this.sessionStorage.setItem(this.key, jsonState);
    }

    persistStorage(slice: string, sliceNewData: any, persistStore: any) {
        if (persistStore && this.persist) {
            const { whitelist } = persistStore;
            const jsonState = this.sessionStorage.getItem(this.key) || '';
            const sessionData = JSON.parse(jsonState);
            const whiteListData = this.whitelistStoreSlice(whitelist, sliceNewData) || {};
            sessionData[slice] = { ...whiteListData };
            this.setStorage(sessionData);
        }
    }

    whitelistStoreSlice(whitelistArr: Array<any>, sliceNewData: any) {
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

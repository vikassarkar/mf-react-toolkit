export declare class StoragePersistance {
    key: string;
    persist: boolean;
    sessionStorage: Storage;
    constructor(key: string, persist: boolean);
    getStorage(): any;
    setStorage(state: any): void;
    persistStorage(slice: string, sliceNewData: any, persistStore: any): void;
    whitelistStoreSlice(whitelistArr: Array<any>, sliceNewData: any): {};
    _init(): void;
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonUtils = void 0;
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const DateFormatter_1 = require("./DateFormatter");
class CommonUtils {
    constructor() {
        this.capitalizeSentence = (sentance) => {
            if (sentance) {
                return sentance.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            }
            return '';
        };
        this.invalidQuery = 'Invalid Query';
    }
    getEnvName() {
        const { pathname } = window.location;
        const lastIndex = pathname.lastIndexOf('/');
        return pathname.substr(1, lastIndex - 1);
    }
    redirectPage(historyRef, route, urlQuery, state = 'route_data') {
        const { search } = window.location;
        if (urlQuery) {
            historyRef.push(`${route}${urlQuery}`, state);
        }
        else {
            historyRef.push(`${route}${search}`, state);
        }
    }
    capitalizeWord(string) {
        if (string) {
            return `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`;
        }
        return '';
    }
    removeWhiteSpace(string) {
        const updatedString = string.replace(/ +(?= )/g, '');
        return updatedString.trim();
    }
    getUrlQueryOject() {
        const queryObj = window.location.search
            .slice(1)
            .split('&')
            .map((p) => p.split('='))
            .reduce((obj, pair) => {
            const [key, value] = pair.map(decodeURIComponent);
            return (Object.assign(Object.assign({}, obj), { [key]: value }));
        }, {});
        return !(0, isEmpty_1.default)(queryObj) ? queryObj : {};
    }
    getUrlQueryValue(key) {
        const queryString = window.location.search.substring(1);
        const queriedArr = queryString.split('&');
        const filteredQuery = queriedArr.filter((IndividualQuery) => {
            const pair = IndividualQuery.split('=');
            if (pair[0] === key) {
                return pair[1];
            }
            return false;
        });
        return !(0, isEmpty_1.default)(filteredQuery) ? filteredQuery[0].split('=')[1] : '';
    }
    getCurrentDate() {
        return DateFormatter_1.dateFormatter.getFormatedDate(new Date(), 'YYYYMMDD');
    }
    getCurrentPage() {
        const { pathname } = window.location;
        const pathnameArr = pathname.split('/');
        return pathnameArr[pathnameArr.length - 1];
    }
    isCurrentPage(pageName) {
        const currentPage = this.getCurrentPage();
        return currentPage === pageName;
    }
    scrollToTop(element = null, animate = true) {
        const el = element;
        if (el) {
            if (el.scrollTo) {
                el.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            else if (el.scrollTop) {
                el.scrollTop = 0;
            }
        }
        else {
            window.scrollTo({
                top: 0,
                behavior: animate ? 'smooth' : 'auto'
            });
        }
    }
    getUserDataFromLocalStorage(storage = 'local_data') {
        const storageData = localStorage.getItem(storage)
            ? JSON.parse(localStorage.getItem(storage)) : {};
        return storageData;
    }
    getUserDataFromSessionStorage(storage = 'session_data') {
        const sessionData = sessionStorage.getItem(storage)
            ? JSON.parse(sessionStorage.getItem(storage)) : {};
        return sessionData;
    }
    setUserDataInLocalStorage(value, storage = 'local_data') {
        localStorage.setItem(storage, typeof (value) === 'string' ? value : JSON.stringify(value));
    }
    setUserDataInSessionStorage(value, storage = 'session_data') {
        sessionStorage.setItem(storage, typeof (value) === 'string' ? value : JSON.stringify(value));
    }
}
exports.commonUtils = new CommonUtils();
//# sourceMappingURL=CommonUtils.js.map
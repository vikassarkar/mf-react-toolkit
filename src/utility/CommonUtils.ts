import _includes from 'lodash/includes';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import { dateFormatter } from './DateFormatter';

class CommonUtils {
    invalidQuery: string;
    constructor() {
        this.invalidQuery = 'Invalid Query';
    }

    /** gets env name from url */
    getEnvName() {
        const { pathname } = window.location;
        const lastIndex = pathname.lastIndexOf('/');
        return pathname.substr(1, lastIndex - 1);
    }

    /** Navigate with history ref  */
    redirectPage(historyRef: any, route: string, urlQuery: string, state: any = 'route_data') {
        const { search } = window.location;
        if (urlQuery) {
            historyRef.push(`${route}${urlQuery}`, state);
        } else {
            historyRef.push(`${route}${search}`, state);
        }
    }

    /** capitalize a given string */
    capitalizeWord(string: string) {
        if (string) {
            return `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`;
        }
        return '';
    }

    /** capitalize a given sentance */
    capitalizeSentence = (sentance: string) => {
        if (sentance) {
            return sentance.toLowerCase().split(' ').map((word) =>
                word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
        return '';
    }

    /** remove white spaces in given string */
    removeWhiteSpace(string: string) {
        const updatedString = string.replace(/ +(?= )/g, '');
        return updatedString.trim();
    }

    /** returns all URL query parameters in json object */
    getUrlQueryOject() {
        const queryObj = window.location.search
            .slice(1)
            .split('&')
            .map((p) => p.split('='))
            .reduce((obj, pair) => {
                const [key, value] = pair.map(decodeURIComponent);
                return ({ ...obj, [key]: value });
            }, {});
        return !_isEmpty(queryObj) ? queryObj : {};
    }

    /** returns specific value from URL query parameter on basis of args */
    getUrlQueryValue(key: string) {
        const queryString = window.location.search.substring(1);
        const queriedArr = queryString.split('&');
        const filteredQuery = queriedArr.filter((IndividualQuery) => {
            const pair = IndividualQuery.split('=');
            if (pair[0] === key) {
                return pair[1];
            }
            return false;
        });
        return !_isEmpty(filteredQuery) ? filteredQuery[0].split('=')[1] : '';
    }

    /** returns system date */
    getCurrentDate() {
        return dateFormatter.getFormatedDate(new Date(), 'YYYYMMDD');
    }

    /** gets current page name from URL */
    getCurrentPage() {
        const { pathname } = window.location;
        const pathnameArr = pathname.split('/');
        return pathnameArr[pathnameArr.length - 1];
    }

    /** checks if passed arg is current page */
    isCurrentPage(pageName: string) {
        const currentPage = this.getCurrentPage();
        return currentPage === pageName;
    }

    /** scolls to window/scrolling container top */
    scrollToTop(element: any = null, animate: boolean = true) {
        const el = element;
        if (el) {
            if (el.scrollTo) {
                el.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else if (el.scrollTop) {
                el.scrollTop = 0;
            }
        } else {
            window.scrollTo({
                top: 0,
                behavior: animate ? 'smooth' : 'auto'
            });
        }
    }

    /** get value from storage in json format, if stored in local storage */
    getUserDataFromLocalStorage(storage: string = 'local_data') {
        const storageData = localStorage.getItem(storage)
            ? JSON.parse(localStorage.getItem(storage)) : {};
        return storageData;
    }

    /** get value from session in json format, if stored in session storage  */
    getUserDataFromSessionStorage(storage: string = 'session_data') {
        const sessionData = sessionStorage.getItem(storage)
            ? JSON.parse(sessionStorage.getItem(storage)) : {};
        return sessionData;
    }

    /** set value in local storage */
    setUserDataInLocalStorage(value: any, storage: string = 'local_data') {
        localStorage.setItem(storage, typeof (value) === 'string' ? value : JSON.stringify(value));
    }

    /** set value in session storage */
    setUserDataInSessionStorage(value: any, storage: string = 'session_data') {
        sessionStorage.setItem(storage, typeof (value) === 'string' ? value : JSON.stringify(value));
    }
}

export const commonUtils = new CommonUtils();

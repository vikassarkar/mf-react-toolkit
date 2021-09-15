import moment, { Moment } from 'moment';
import _isNaN from 'lodash/isNaN';
import _isEmpty from 'lodash/isEmpty';
import _isArray from 'lodash/isArray';
import _includes from 'lodash/includes';
import { dateFormats } from '../constants';

class DateFormatter {
    invalidFormatText: string;
    invalidDateText: string;
    baseDate: Date;
    constructor() {
        this.invalidFormatText = 'Invali Date Format';
        this.invalidDateText = 'Invalid date';
        this.baseDate = new Date();
    }

    /** gets infinite date for max date in date picker* */
    getInfiniteDate = () => new Date(8640000000000000);

    /** converts string from 'fromFormat' to 'toFormat' format. '02/2020', 'MM/YYYY', 'YYYYMMDD' */
    getDateInMomentFormat(val: Date, fromFormat: string, toFormat: string = 'YYYYMMDD', endOfMonth: boolean = false) {
        return this._getMomentFormattedDate(moment(val, fromFormat), toFormat, endOfMonth);
    }

    /** YYYY, YY ** 2019, 19 */
    getYear(date: string | Date, format: string = 'YYYY') {
        return this._getMomentFormattedDate(date, format);
    }

    /** D, Do, DD ** 2, 2nd, 02 */
    getDate(date: string | Date, format: string = 'DD') {
        return this._getMomentFormattedDate(date, format);
    }

    /** M, Mo, MM, MMM, MMMM ** 1, 1st, 01, Jan, January */
    getMonth(date: string | Date, format: string = 'MM') {
        return this._getMomentFormattedDate(date, format);
    }

    /** d, dd, ddd, dddd ** 0, Su, Sun, Sunday */
    getDay(date: string | Date, format: string = 'dddd') {
        return this._getMomentFormattedDate(date, format);
    }

    /** format - date with some format provided */
    getFormatedDate(date: string | Date, format: string = 'YYYYMMDD') {
        return this._getMomentFormattedDate(date, format);
    }

    /** format - date as -> 2014-09-07T00:00:00+05:30 */
    getFormatedDateWithTimeZone(date: string | Date) {
        return new Date(this._getMomentFormattedDate(date, ''));
    }

    /** get back date by subtracting provided days from base date  */
    getBackDateByDays(date: string | Date = this.baseDate, days: number = 1, format: string = 'YYYYMMDD') {
        const maxDate = this._getMomentFormattedDate(date, format);
        return maxDate ? moment(maxDate).subtract(days, 'days').format(dateFormats[format]) : '';
    }

    /** get back date by subtracting provided years from base date */
    getBackDateByYears(date: string | Date = this.baseDate, years: number = 2, format: string = 'YYYYMMDD') {
        const maxDate = this._getMomentFormattedDate(date, format);
        return maxDate ? moment(maxDate).subtract(years, 'years').format(dateFormats[format]) : '';
    }

    /** get back date by subtracting provided months from base date */
    getBackDateByMonths(date: string | Date = this.baseDate, months: number = 6, format: string = 'YYYYMMDD') {
        const maxDate = this._getMomentFormattedDate(date, format);
        return maxDate ? moment(maxDate).subtract(months, 'months').format(dateFormats[format]) : '';
    }

    /** get difference in dates, and return value in 'months'/'years'/'days' */
    getDateDifference(date: string | Date, baseDate: string | Date = this.baseDate, diffUnit: any = 'days') {
        const mainDate = this._getMomentFormattedDate(date, 'YYYYMMDD');
        const calculatingDate = this._getMomentFormattedDate(baseDate, 'YYYYMMDD');
        const dateDiff: any = moment(moment(mainDate).toDate())
            .diff(moment(calculatingDate).toDate(), diffUnit);
        return dateDiff && !_isNaN(dateDiff) ? parseInt(dateDiff) : 0;
    }

    /** gets back time string of date value */
    getDateInTimeString(date: string | Date) {
        if (_isArray(date)) {
            if (!_includes(date[0], '-')) {
                return moment(moment(new Date(Number(date))).toDate()).valueOf();
            }
        }
        return moment(moment(new Date(date)).toDate()).valueOf();
    }

    /** get age with DOB provided and return age inmonths/years/days */
    getAge(date: string | Date, format: any = 'years') {
        const age = moment().diff(moment(moment(date).toDate()), format);
        return !_isNaN(age) ? age : 0;
    }


    /** checks if dates are same */
    isSameDate(date: string | Date, baseDate: string | Date = this.baseDate) {
        return this._calculateDateDifference(date, baseDate, 'days') === 0;
    }

    /** checks if date is expired date from base date */
    isExpiredDate(date: string | Date, baseDate: string | Date = this.baseDate) {
        return this._calculateDateDifference(date, baseDate, 'days') < 0;
    }

    /** checks if date is future date from base date */
    isFutureDate(date: string | Date, baseDate: string | Date = this.baseDate) {
        return this._calculateDateDifference(date, baseDate, 'days') > 0;
    }

    /** checks if date is between start and end date  */
    isDateInBetween(date: string | Date, startDate: string | Date, endDate: string | Date) {
        return moment(new Date(date)).isBetween(moment(new Date(startDate)), moment(new Date(endDate)))
            || moment(new Date(date)).isSame(moment(new Date(startDate))) || moment(new Date(date)).isSame(moment(new Date(endDate)));
    }

    /** calculate difference in dates, in 'months', 'years' and 'days' */
    _calculateDateDifference(date: string | Date, baseDate: string | Date = this.baseDate, diffUnit: any = 'days') {
        const mainDate = this._getMomentFormattedDate(date, 'YYYYMMDD');
        const calculatingDate = this._getMomentFormattedDate(baseDate, 'YYYYMMDD');
        const dateDiff: any = moment(moment(mainDate).toDate())
            .diff(moment(calculatingDate).toDate(), diffUnit);
        return dateDiff && !_isNaN(dateDiff) ? parseInt(dateDiff, 10) : 0;
    }

    /** check if available date is good to format else return 'invalid date' text */
    _getMomentFormattedDate(date: string | Date | Moment, format: string, endOfMonth: boolean = false) {
        let momentDate = moment(date);
        if (endOfMonth === true) {
            momentDate = momentDate.endOf('month');
        }
        const formattedDate = date && moment(momentDate.toDate()).format(dateFormats[format] || '');
        if (!_isEmpty(formattedDate) && formattedDate !== this.invalidDateText) {
            return formattedDate;
        }
        return '';
    }
}

export const dateFormatter = new DateFormatter();

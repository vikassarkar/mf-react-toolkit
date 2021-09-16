"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateFormatter = void 0;
const moment_1 = __importDefault(require("moment"));
const isNaN_1 = __importDefault(require("lodash/isNaN"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const isArray_1 = __importDefault(require("lodash/isArray"));
const includes_1 = __importDefault(require("lodash/includes"));
const constants_1 = require("../constants");
class DateFormatter {
    constructor() {
        this.getInfiniteDate = () => new Date(8640000000000000);
        this.invalidFormatText = 'Invali Date Format';
        this.invalidDateText = 'Invalid date';
        this.baseDate = new Date();
    }
    getDateInMomentFormat(val, fromFormat, toFormat = 'YYYYMMDD', endOfMonth = false) {
        return this._getMomentFormattedDate((0, moment_1.default)(val, fromFormat), toFormat, endOfMonth);
    }
    getYear(date, format = 'YYYY') {
        return this._getMomentFormattedDate(date, format);
    }
    getDate(date, format = 'DD') {
        return this._getMomentFormattedDate(date, format);
    }
    getMonth(date, format = 'MM') {
        return this._getMomentFormattedDate(date, format);
    }
    getDay(date, format = 'dddd') {
        return this._getMomentFormattedDate(date, format);
    }
    getFormatedDate(date, format = 'YYYYMMDD') {
        return this._getMomentFormattedDate(date, format);
    }
    getFormatedDateWithTimeZone(date) {
        return new Date(this._getMomentFormattedDate(date, ''));
    }
    getBackDateByDays(date = this.baseDate, days = 1, format = 'YYYYMMDD') {
        const maxDate = this._getMomentFormattedDate(date, format);
        return maxDate ? (0, moment_1.default)(maxDate).subtract(days, 'days').format(constants_1.dateFormats[format]) : '';
    }
    getBackDateByYears(date = this.baseDate, years = 2, format = 'YYYYMMDD') {
        const maxDate = this._getMomentFormattedDate(date, format);
        return maxDate ? (0, moment_1.default)(maxDate).subtract(years, 'years').format(constants_1.dateFormats[format]) : '';
    }
    getBackDateByMonths(date = this.baseDate, months = 6, format = 'YYYYMMDD') {
        const maxDate = this._getMomentFormattedDate(date, format);
        return maxDate ? (0, moment_1.default)(maxDate).subtract(months, 'months').format(constants_1.dateFormats[format]) : '';
    }
    getDateDifference(date, baseDate = this.baseDate, diffUnit = 'days') {
        const mainDate = this._getMomentFormattedDate(date, 'YYYYMMDD');
        const calculatingDate = this._getMomentFormattedDate(baseDate, 'YYYYMMDD');
        const dateDiff = (0, moment_1.default)((0, moment_1.default)(mainDate).toDate())
            .diff((0, moment_1.default)(calculatingDate).toDate(), diffUnit);
        return dateDiff && !(0, isNaN_1.default)(dateDiff) ? parseInt(dateDiff) : 0;
    }
    getDateInTimeString(date) {
        if ((0, isArray_1.default)(date)) {
            if (!(0, includes_1.default)(date[0], '-')) {
                return (0, moment_1.default)((0, moment_1.default)(new Date(Number(date))).toDate()).valueOf();
            }
        }
        return (0, moment_1.default)((0, moment_1.default)(new Date(date)).toDate()).valueOf();
    }
    getAge(date, format = 'years') {
        const age = (0, moment_1.default)().diff((0, moment_1.default)((0, moment_1.default)(date).toDate()), format);
        return !(0, isNaN_1.default)(age) ? age : 0;
    }
    isSameDate(date, baseDate = this.baseDate) {
        return this._calculateDateDifference(date, baseDate, 'days') === 0;
    }
    isExpiredDate(date, baseDate = this.baseDate) {
        return this._calculateDateDifference(date, baseDate, 'days') < 0;
    }
    isFutureDate(date, baseDate = this.baseDate) {
        return this._calculateDateDifference(date, baseDate, 'days') > 0;
    }
    isDateInBetween(date, startDate, endDate) {
        return (0, moment_1.default)(new Date(date)).isBetween((0, moment_1.default)(new Date(startDate)), (0, moment_1.default)(new Date(endDate)))
            || (0, moment_1.default)(new Date(date)).isSame((0, moment_1.default)(new Date(startDate))) || (0, moment_1.default)(new Date(date)).isSame((0, moment_1.default)(new Date(endDate)));
    }
    _calculateDateDifference(date, baseDate = this.baseDate, diffUnit = 'days') {
        const mainDate = this._getMomentFormattedDate(date, 'YYYYMMDD');
        const calculatingDate = this._getMomentFormattedDate(baseDate, 'YYYYMMDD');
        const dateDiff = (0, moment_1.default)((0, moment_1.default)(mainDate).toDate())
            .diff((0, moment_1.default)(calculatingDate).toDate(), diffUnit);
        return dateDiff && !(0, isNaN_1.default)(dateDiff) ? parseInt(dateDiff, 10) : 0;
    }
    _getMomentFormattedDate(date, format, endOfMonth = false) {
        let momentDate = (0, moment_1.default)(date);
        if (endOfMonth === true) {
            momentDate = momentDate.endOf('month');
        }
        const formattedDate = date && (0, moment_1.default)(momentDate.toDate()).format(constants_1.dateFormats[format] || '');
        if (!(0, isEmpty_1.default)(formattedDate) && formattedDate !== this.invalidDateText) {
            return formattedDate;
        }
        return '';
    }
}
exports.dateFormatter = new DateFormatter();
//# sourceMappingURL=DateFormatter.js.map
import { Moment } from 'moment';
declare class DateFormatter {
    invalidFormatText: string;
    invalidDateText: string;
    baseDate: Date;
    constructor();
    getInfiniteDate: () => Date;
    getDateInMomentFormat(val: Date, fromFormat: string, toFormat?: string, endOfMonth?: boolean): string;
    getYear(date: string | Date, format?: string): string;
    getDate(date: string | Date, format?: string): string;
    getMonth(date: string | Date, format?: string): string;
    getDay(date: string | Date, format?: string): string;
    getFormatedDate(date: string | Date, format?: string): string;
    getFormatedDateWithTimeZone(date: string | Date): Date;
    getBackDateByDays(date?: string | Date, days?: number, format?: string): string;
    getBackDateByYears(date?: string | Date, years?: number, format?: string): string;
    getBackDateByMonths(date?: string | Date, months?: number, format?: string): string;
    getDateDifference(date: string | Date, baseDate?: string | Date, diffUnit?: any): number;
    getDateInTimeString(date: string | Date): number;
    getAge(date: string | Date, format?: any): number;
    isSameDate(date: string | Date, baseDate?: string | Date): boolean;
    isExpiredDate(date: string | Date, baseDate?: string | Date): boolean;
    isFutureDate(date: string | Date, baseDate?: string | Date): boolean;
    isDateInBetween(date: string | Date, startDate: string | Date, endDate: string | Date): boolean;
    _calculateDateDifference(date: string | Date, baseDate?: string | Date, diffUnit?: any): number;
    _getMomentFormattedDate(date: string | Date | Moment, format: string, endOfMonth?: boolean): string;
}
export declare const dateFormatter: DateFormatter;
export {};

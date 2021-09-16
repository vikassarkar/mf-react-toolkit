"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentFormatter = void 0;
class ContentFormatter {
    limitContent(str, limitLength) {
        if (str) {
            const text = str.replace(/ +/g, ' ');
            if (text && text.length >= limitLength) {
                return `${text.slice(0, limitLength)}...`;
            }
            return text;
        }
        return null;
    }
    formatPostCode(str) {
        if (str) {
            return str.replace(' ', '').replace(/(?=.{3}$)/, ' ').trim().toUpperCase();
        }
        return '';
    }
    formatSimNumber(str) {
        if (str) {
            return str.replace(/[^\d*]/g, '').replace(/(.{4})/g, '$1 ').trim();
        }
        return '';
    }
    formatCardNumber(str) {
        return str.replace(/[^\d*]/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    formatFloatWithoutRoundof(floatNumber, decimalPoint = 2) {
        return (Math.abs(parseFloat(floatNumber) * 100) / 100).toFixed(decimalPoint);
    }
    formatFloatWithRoundof(floatNumber, decimalPoint = 2) {
        return (parseFloat(floatNumber)).toFixed(decimalPoint);
    }
    formatAmount(amount, currency = '$', decimalPoint = 2, withRoundOf = false) {
        const roundofMethod = withRoundOf ? this.formatFloatWithRoundof
            : this.formatFloatWithoutRoundof;
        if (amount || amount === 0) {
            return amount < 0
                ? `- ${currency}${roundofMethod(Math.abs(amount), decimalPoint)}`
                : `${currency}${roundofMethod(amount, decimalPoint)}`;
        }
        return null;
    }
}
exports.contentFormatter = new ContentFormatter();
//# sourceMappingURL=ContentFormatter.js.map
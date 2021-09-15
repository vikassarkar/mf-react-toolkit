class ContentFormatter {
    /** adds '...' as ellipse for contents max character limit */
    limitContent(str: string, limitLength: number) {
        if (str) {
            const text = str.replace(/ +/g, ' ');
            if (text && text.length >= limitLength) {
                return `${text.slice(0, limitLength)}...`;
            }
            return text;
        }
        return null;
    }

    /** formatts string in post code format */
    formatPostCode(str: string) {
        if (str) {
            return str.replace(' ', '').replace(/(?=.{3}$)/, ' ').trim().toUpperCase();
        }
        return '';
    }

    /** formatts string simnumber format */
    formatSimNumber(str: string) {
        if (str) {
            return str.replace(/[^\d*]/g, '').replace(/(.{4})/g, '$1 ').trim();
        }
        return '';
    }

    /** formatts card number string in card number formatt */
    formatCardNumber(str: string) {
        return str.replace(/[^\d*]/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    /** formats a number to defined decimal points without rounding it off */
    formatFloatWithoutRoundof(floatNumber: any, decimalPoint: number = 2) {
        return (Math.abs(parseFloat(floatNumber) * 100) / 100).toFixed(decimalPoint);
    }

    /** formats a number to defined decimal points with rounding it off */
    formatFloatWithRoundof(floatNumber: any, decimalPoint: number = 2) {
        return (parseFloat(floatNumber)).toFixed(decimalPoint);
    }

    /** amount in $/£ in negative and positive format */
    formatAmount(amount: any, currency: string = '$', decimalPoint: number = 2, withRoundOf: boolean = false) {
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

export const contentFormatter = new ContentFormatter();

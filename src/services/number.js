import numeral from "numeral";
import BN from "bn.js";

export const usdDecimals = 0

export function round(num, decimals) {
    const pow = 10 ** decimals;
    return Math.round((num + Number.EPSILON) * pow) / pow;
}

export function formatNumber(value, options = {}) {
    const { rep = '-' } = options

    if ((value instanceof BN && value.isZero()) || value === 0) return rep

    let { reduce, symbol, decimals, format } = options

    reduce = reduce !== undefined ? reduce : true;
    symbol = symbol !== undefined ? symbol : "$";
    decimals = decimals !== undefined ? decimals : usdDecimals;

    const isUsd = symbol === "$";
    let subfix = !isUsd ? ` ${symbol}` : '';
    let prefix = isUsd ? `${symbol} ` : '';

    if (value instanceof BN) {
        value = bnDiv(value, new BN(10 ** decimals));
    } else {
        value = value / 10 ** decimals
    }

    const [, dec = ''] = value.toString().split('.')
    const firstSignificant = (dec.split('').findIndex((digit) => digit !== '0') || 0) + 1
    const extraDecimals = Math.max(0, 1 + firstSignificant - 2)
    format = format || `0,0[.]00${extraDecimals > 0 ? `[${Array(extraDecimals).join('0')}]` : ''}a`;

    return `${prefix}${numeral(value).format(format)}${subfix}`
}

export function bnDiv(numerator, denominator) {
    denominator = denominator instanceof BN ? denominator : new BN(denominator)
    if (denominator.eqn(1)) return numerator

    const { div, mod: rem } = numerator.divmod(denominator)
    const quotient = div.toNumber();
    const gcd = rem.gcd(denominator);
    return quotient + rem.div(gcd).toNumber() / denominator.div(gcd).toNumber();
}

export function bnDivPerc(numerator, denominator) {
    denominator = denominator instanceof BN ? denominator : new BN(denominator)

    if (denominator.isZero()) return 0

    let perc = 0

    try {
        perc = bnDiv(numerator, denominator)
    } catch (e) {
        const mcpow = Math.min(numerator.toString().length, denominator.toString().length)
        const reducedNumerator = numerator.divn(mcpow)
        const reducedDenominator = denominator.divn(mcpow)
        perc = bnDiv(reducedNumerator, reducedDenominator)
    }

    return round(perc * 100, 2)
}

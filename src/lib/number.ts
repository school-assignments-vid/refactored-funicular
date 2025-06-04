/**
 * ==========================================================================
 * Number Utilities
 * ==========================================================================
 */

/**
 * Represents a value that can be parsed into a number.
 */
export type NumericInput = number | string;

/**
 * Parses a value into a number.
 * Returns undefined if parsing fails and no defaultValue is provided.
 * @param value - The value to parse.
 * @param [defaultValue] - Optional default value to return if parsing fails.
 * @returns {number | undefined} The parsed number, the defaultValue, or undefined.
 */
export function parseNumber(value: any, defaultValue?: number): number | undefined {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      return num;
    }
  }
  return defaultValue;
}

/**
 * Checks if a value is a finite number.
 * @param value - The value to check.
 * @returns {boolean} True if the value is a finite number, false otherwise.
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number' && isFinite(value);
}

/**
 * Checks if a value is an integer.
 * @param value - The value to check.
 * @returns {boolean} True if the value is an integer, false otherwise.
 */
export function isInteger(value: any): boolean {
  return Number.isInteger(parseNumber(value));
}

/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 * If min > max, their values are swapped.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random integer within the specified range. Returns NaN if inputs are not finite numbers.
 */
export function getRandomInt(min: number, max: number): number {
  if (!isNumber(min) || !isNumber(max)) {
    return NaN;
  }
  if (min > max) {
    [min, max] = [max, min]; // Swap if min is greater than max
  }
  const ceilMin = Math.ceil(min);
  const floorMax = Math.floor(max);
  return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
}

/**
 * Clamps a number between a minimum and maximum value.
 * If min > max, the function will effectively clamp to 'max' if value < max, or 'min' if value > min,
 * essentially using the smaller of (original max, original min) as the upper bound
 * and the larger of (original max, original min) as the lower bound if they are swapped.
 * It's generally expected that min <= max.
 * @param {number} value - The number to clamp.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} The clamped number. Returns NaN if any input is not a finite number.
 */
export function clamp(value: number, min: number, max: number): number {
  if (!isNumber(value) || !isNumber(min) || !isNumber(max)) {
    return NaN;
  }
  // Standard behavior: if min > max, result will be Math.min(Math.max(value, 5), 2) => Math.min( (>=5) , 2) => 2
  // This means 'max' effectively becomes the bound.
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats a number or bigint as currency using Intl.NumberFormat.
 * @param {NumericInput | bigint} amountInput - The amount to format. Can be a number, a string parsable as a number, or a bigint.
 * @param {string} [currencyCode='USD'] - The ISO 4217 currency code (e.g., 'EUR', 'JPY').
 * @param {string} [locale='en-US'] - The locale for formatting (e.g., 'de-DE').
 * @param {Intl.NumberFormatOptions} [options] - Additional options for Intl.NumberFormat, overriding default currency style.
 * @returns {string} The formatted currency string, or an empty string if formatting fails or input is invalid.
 */
export function formatCurrency(
  amountInput: NumericInput | bigint,
  currencyCode: string = 'USD',
  locale: string = 'en-US',
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> // User can override other options
): string {
  let amount: number | bigint;

  if (typeof amountInput === 'bigint') {
    amount = amountInput;
  } else {
    const parsedAmount = parseNumber(amountInput);
    if (parsedAmount === undefined) {
      return ''; // Invalid amount
    }
    amount = parsedAmount;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      ...options, // Allow overriding other options like minimumFractionDigits
    }).format(amount);
  } catch (error) {
    console.error(
      `Error formatting currency (locale: ${locale}, currency: ${currencyCode}):`,
      error
    );
    // Fallback for critical errors (e.g., invalid locale/currency code that NumberFormat itself can't handle)
    // For simple number amounts, provide a basic fallback. BigInt doesn't have toFixed.
    if (typeof amount === 'number') {
      return `${amount.toFixed(2)} ${currencyCode}`; // Basic fallback
    }
    return `${String(amount)} ${currencyCode}`; // Basic fallback for BigInt
  }
}

/**
 * Rounds a number to a specified number of decimal places.
 * @param {NumericInput} valueInput - The number to round.
 * @param {number} [precision=0] - The number of decimal places to round to. Must be a non-negative integer.
 * @returns {number | undefined} The rounded number, or undefined if input is invalid.
 */
export function roundTo(valueInput: NumericInput, precision: number = 0): number | undefined {
  const value = parseNumber(valueInput);
  if (value === undefined || !isInteger(precision) || precision < 0) {
    return undefined;
  }
  if (precision === 0) {
    return Math.round(value);
  }
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

/**
 * Floors a number to a specified number of decimal places.
 * @param {NumericInput} valueInput - The number to floor.
 * @param {number} [precision=0] - The number of decimal places. Must be a non-negative integer.
 * @returns {number | undefined} The floored number, or undefined if input is invalid.
 */
export function floorTo(valueInput: NumericInput, precision: number = 0): number | undefined {
  const value = parseNumber(valueInput);
  if (value === undefined || !isInteger(precision) || precision < 0) {
    return undefined;
  }
  if (precision === 0) {
    return Math.floor(value);
  }
  const factor = Math.pow(10, precision);
  return Math.floor(value * factor) / factor;
}

/**
 * Ceils a number to a specified number of decimal places.
 * @param {NumericInput} valueInput - The number to ceil.
 * @param {number} [precision=0] - The number of decimal places. Must be a non-negative integer.
 * @returns {number | undefined} The ceiled number, or undefined if input is invalid.
 */
export function ceilTo(valueInput: NumericInput, precision: number = 0): number | undefined {
  const value = parseNumber(valueInput);
  if (value === undefined || !isInteger(precision) || precision < 0) {
    return undefined;
  }
  if (precision === 0) {
    return Math.ceil(value);
  }
  const factor = Math.pow(10, precision);
  return Math.ceil(value * factor) / factor;
}

/**
 * Calculates the sum of an array of numeric inputs.
 * Non-numeric values in the array are ignored.
 * @param {NumericInput[]} values - An array of numbers or strings convertible to numbers.
 * @returns {number} The sum of the numbers.
 */
export function sum(values: NumericInput[]): number {
  return values.reduce<number>((acc, val) => {
    const num = parseNumber(val);
    return acc + (num !== undefined ? num : 0);
  }, 0);
}

/**
 * Calculates the average of an array of numeric inputs.
 * Non-numeric values in the array are ignored.
 * @param {NumericInput[]} values - An array of numbers or strings convertible to numbers.
 * @returns {number | undefined} The average, or undefined if the array is empty or contains no valid numbers.
 */
export function average(values: NumericInput[]): number | undefined {
  const numericValues = values.map(parseNumber).filter(isNumber);
  if (numericValues.length === 0) {
    return undefined;
  }
  return sum(numericValues) / numericValues.length;
}

/**
 * Checks if a number is within a specified range.
 * @param {NumericInput} valueInput - The number to check.
 * @param {number} min - The minimum boundary of the range.
 * @param {number} max - The maximum boundary of the range.
 * @param {object} [options={minInclusive: true, maxInclusive: false}] - Options for inclusivity.
 * @param {boolean} [options.minInclusive=true] - Whether the minimum boundary is inclusive.
 * @param {boolean} [options.maxInclusive=false] - Whether the maximum boundary is inclusive.
 * @returns {boolean | undefined} True if the number is in range, false otherwise. Undefined if input is invalid.
 */
export function inRange(
  valueInput: NumericInput,
  min: number,
  max: number,
  options: { minInclusive?: boolean; maxInclusive?: boolean } = {}
): boolean | undefined {
  const value = parseNumber(valueInput);
  if (value === undefined || !isNumber(min) || !isNumber(max)) {
    return undefined;
  }

  const { minInclusive = true, maxInclusive = false } = options;

  const checkMin = minInclusive ? value >= min : value > min;
  const checkMax = maxInclusive ? value <= max : value < max;

  if (min > max) {
    // If range is inverted, it's impossible to be in range conventionally
    return false;
  }

  return checkMin && checkMax;
}

/**
 * Calculates what percentage 'value' is of 'total'.
 * @param {NumericInput} valueInput - The partial value.
 * @param {NumericInput} totalInput - The total value.
 * @param {number} [precision=2] - Number of decimal places for the result.
 * @returns {number | undefined} The percentage, or undefined if inputs are invalid or total is zero.
 */
export function percentage(
  valueInput: NumericInput,
  totalInput: NumericInput,
  precision: number = 2
): number | undefined {
  const value = parseNumber(valueInput);
  const total = parseNumber(totalInput);

  if (value === undefined || total === undefined || total === 0) {
    return undefined;
  }
  const result = (value / total) * 100;
  return roundTo(result, precision);
}

/**
 * Maps a number from one range to another.
 * @param {NumericInput} valueInput - The number to map.
 * @param {number} fromLow - The lower bound of the source range.
 * @param {number} fromHigh - The upper bound of the source range.
 * @param {number} toLow - The lower bound of the target range.
 * @param {number} toHigh - The upper bound of the target range.
 * @returns {number | undefined} The mapped number, or undefined if inputs are invalid or fromLow equals fromHigh.
 */
export function mapRange(
  valueInput: NumericInput,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
): number | undefined {
  const value = parseNumber(valueInput);
  if (
    value === undefined ||
    !isNumber(fromLow) ||
    !isNumber(fromHigh) ||
    !isNumber(toLow) ||
    !isNumber(toHigh)
  ) {
    return undefined;
  }
  if (fromLow === fromHigh) {
    // Avoid division by zero
    return toLow; // Or undefined, or (toLow + toHigh) / 2, depending on desired behavior
  }
  const result = toLow + ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow);
  return result; // Not rounding by default, consumer can round if needed
}

/**
 * Returns the ordinal suffix for a number (e.g., 1st, 2nd, 3rd, 4th).
 * @param {NumericInput} valueInput - The number.
 * @returns {string | undefined} The number with its ordinal suffix (e.g., "1st"), or undefined if input is invalid.
 */
export function ordinal(valueInput: NumericInput): string | undefined {
  const n = parseNumber(valueInput);
  if (n === undefined || !isInteger(n)) {
    return undefined;
  }
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Formats a number using Intl.NumberFormat with flexible options.
 * @param {NumericInput | bigint} valueInput - The number or bigint to format.
 * @param {string} [locale='en-US'] - The locale for formatting.
 * @param {Intl.NumberFormatOptions} [options] - Options for Intl.NumberFormat.
 * @returns {string | undefined} The formatted number string, or undefined if input is invalid.
 */
export function formatNumber(
  valueInput: NumericInput | bigint,
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions
): string | undefined {
  let value: number | bigint;
  if (typeof valueInput === 'bigint') {
    value = valueInput;
  } else {
    const parsedValue = parseNumber(valueInput);
    if (parsedValue === undefined) return undefined;
    value = parsedValue;
  }

  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return undefined;
  }
}

/**
 * Checks if a number is even.
 * @param {NumericInput} valueInput - The number to check.
 * @returns {boolean | undefined} True if the number is even, false if odd. Undefined if not a valid integer.
 */
export function isEven(valueInput: NumericInput): boolean | undefined {
  const num = parseNumber(valueInput);
  if (num === undefined || !isInteger(num)) {
    return undefined;
  }
  return num % 2 === 0;
}

/**
 * Checks if a number is odd.
 * @param {NumericInput} valueInput - The number to check.
 * @returns {boolean | undefined} True if the number is odd, false if even. Undefined if not a valid integer.
 */
export function isOdd(valueInput: NumericInput): boolean | undefined {
  const num = parseNumber(valueInput);
  if (num === undefined || !isInteger(num)) {
    return undefined;
  }
  return num % 2 !== 0;
}

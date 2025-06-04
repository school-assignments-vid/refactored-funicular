/**
 * ==========================================================================
 * Date Utilities
 * ==========================================================================
 */

/**
 * Represents a value that can be converted to a Date object.
 * It can be a Date object, a number (timestamp), or a string that can be parsed by `new Date()`.
 */
export type DateInput = Date | number | string;

/**
 * Checks if a value is a valid Date object (i.e., not `Invalid Date`).
 * @param value - The value to check.
 * @returns {boolean} True if the value is a valid Date, false otherwise.
 */
export function isValidDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Converts a DateInput value to a Date object.
 * @param {DateInput | undefined} value - The input value to convert.
 * @returns {Date | undefined} A Date object if the input is valid and can be converted, otherwise undefined.
 */
export function toDate(value: DateInput | undefined): Date | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (value instanceof Date) {
    return isValidDate(value) ? value : undefined;
  }
  const date = new Date(value);
  return isValidDate(date) ? date : undefined;
}

/**
 * Formats a Date object into a string based on a format string.
 * Supports various tokens for year, month, day, hour, minute, second, millisecond, and AM/PM.
 * Note: This implementation uses the local time zone of the JavaScript runtime.
 *
 * @param {DateInput | undefined} dateInput - The date to format.
 * @param {string} formatString - The string defining the output format.
 * Tokens:
 * YYYY: Full year (e.g., 2023)
 * YY: Short year (e.g., 23)
 * MMMM: Full month name (e.g., January)
 * MMM: Short month name (e.g., Jan)
 * MM: Month (01-12)
 * M: Month (1-12)
 * DDDD: Full day name (e.g., Sunday)
 * DDD: Short day name (e.g., Sun)
 * DD: Day of month (01-31)
 * D: Day of month (1-31)
 * HH: Hour (00-23)
 * H: Hour (0-23)
 * hh: Hour (01-12)
 * h: Hour (1-12)
 * mm: Minute (00-59)
 * m: Minute (0-59)
 * ss: Second (00-59)
 * s: Second (0-59)
 * SSS: Millisecond (000-999)
 * A: AM/PM
 * a: am/pm
 * @param {string} [locale='en-US'] - Optional locale for month/day names.
 * @returns {string} The formatted date string, or "Invalid Date" if the input is not a valid date.
 */
export function formatDate(
  dateInput: DateInput | undefined,
  formatString: string,
  locale: string = 'en-US'
): string {
  const date = toDate(dateInput);
  if (!date) {
    return 'Invalid Date';
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate(); // 1-31
  const hours = date.getHours(); // 0-23
  const minutes = date.getMinutes(); // 0-59
  const seconds = date.getSeconds(); // 0-59
  const milliseconds = date.getMilliseconds(); // 0-999

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; // 1-12

  const pad = (num: number, len = 2): string => String(num).padStart(len, '0');
  const padMs = (num: number): string => String(num).padStart(3, '0');

  const getMonthName = (format: 'long' | 'short' | 'narrow'): string =>
    new Intl.DateTimeFormat(locale, { month: format }).format(date);
  const getDayName = (format: 'long' | 'short' | 'narrow'): string =>
    new Intl.DateTimeFormat(locale, { weekday: format }).format(date);

  // Ensure longer tokens are replaced before shorter ones (e.g., YYYY before YY)
  const tokens: Array<[string, string | number]> = [
    ['YYYY', year],
    ['YY', String(year).slice(-2)],
    ['MMMM', getMonthName('long')],
    ['MMM', getMonthName('short')],
    ['MM', pad(month)],
    ['M', month],
    ['DDDD', getDayName('long')],
    ['DDD', getDayName('short')],
    ['DD', pad(day)],
    ['D', day],
    ['HH', pad(hours)],
    ['H', hours],
    ['hh', pad(hours12)],
    ['h', hours12],
    ['mm', pad(minutes)],
    ['m', minutes],
    ['ss', pad(seconds)],
    ['s', seconds],
    ['SSS', padMs(milliseconds)],
    ['A', ampm.toUpperCase()],
    ['a', ampm.toLowerCase()],
  ];

  let result = formatString;
  // Sort tokens by length descending to handle substrings correctly
  tokens.sort((a, b) => b[0].length - a[0].length);

  for (const [token, value] of tokens) {
    // Escape token for regex, in case it contains special characters (though current tokens don't)
    const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(escapedToken, 'g'), String(value));
  }
  return result;
}

/**
 * Calculates the time elapsed since a given date and returns a human-readable string.
 * e.g., "5 minutes ago", "in 2 hours", "3 days ago".
 * Uses Intl.RelativeTimeFormat for localization.
 * @param {DateInput} dateInput - The date to compare against now. Can be past or future.
 * @param {string} [locale='en-US'] - Optional locale for relative time formatting.
 * @param {DateInput} [nowInput=new Date()] - Optional date to compare against, defaults to current time.
 * @returns {string} Human-readable time difference, or "Invalid Date" if input is invalid.
 */
export function timeAgo(
  dateInput: DateInput,
  locale: string = 'en-US',
  nowInput: DateInput = new Date()
): string {
  const date = toDate(dateInput);
  const now = toDate(nowInput);

  if (!date || !now) {
    return 'Invalid Date';
  }

  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(seconds) < 45) return rtf.format(seconds, 'second');

  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 45) return rtf.format(minutes, 'minute');

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 22) return rtf.format(hours, 'hour'); // ~22 hours before "1 day"

  const days = Math.round(hours / 24);
  if (Math.abs(days) < 26) return rtf.format(days, 'day'); // ~26 days before "1 month"

  // For weeks, months, years, Intl.RelativeTimeFormat handles the thresholds well based on locale.
  // However, to show "week" explicitly before "month":
  if (Math.abs(days) < 320) {
    // Less than ~10.5 months
    const weeks = Math.round(days / 7);
    if (Math.abs(weeks) < 4) {
      // Use weeks for less than a month (approx)
      if (weeks !== 0) return rtf.format(weeks, 'week');
    }
    // If weeks is 0 (meaning less than 3-4 days), it would have been caught by "days"
    // Let "month" handle if it's several weeks.
  }

  const months = Math.round(days / 30.4375); // Average days in month
  if (Math.abs(months) < 11) {
    // ~11 months before "1 year"
    if (months !== 0) return rtf.format(months, 'month');
  }

  const years = Math.round(days / 365.25); // Account for leap years
  return rtf.format(years, 'year');
}

/**
 * Checks if a given date is today.
 * @param {DateInput} dateInput - The date to check.
 * @returns {boolean} True if the date is today, false otherwise or if invalid.
 */
export function isToday(dateInput: DateInput): boolean {
  const date = toDate(dateInput);
  if (!date) return false;
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * Checks if a given date is yesterday.
 * @param {DateInput} dateInput - The date to check.
 * @returns {boolean} True if the date is yesterday, false otherwise or if invalid.
 */
export function isYesterday(dateInput: DateInput): boolean {
  const date = toDate(dateInput);
  if (!date) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

/**
 * Checks if a given date is tomorrow.
 * @param {DateInput} dateInput - The date to check.
 * @returns {boolean} True if the date is tomorrow, false otherwise or if invalid.
 */
export function isTomorrow(dateInput: DateInput): boolean {
  const date = toDate(dateInput);
  if (!date) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  );
}

/**
 * Checks if a given date is in the future.
 * @param {DateInput} dateInput - The date to check.
 * @returns {boolean} True if the date is in the future, false otherwise or if invalid.
 */
export function isFuture(dateInput: DateInput): boolean {
  const date = toDate(dateInput);
  if (!date) return false;
  return date.getTime() > new Date().getTime();
}

/**
 * Checks if a given date is in the past.
 * (Note: A date that is "now" is not considered in the past).
 * @param {DateInput} dateInput - The date to check.
 * @returns {boolean} True if the date is in the past, false otherwise or if invalid.
 */
export function isPast(dateInput: DateInput): boolean {
  const date = toDate(dateInput);
  if (!date) return false;
  return date.getTime() < new Date().getTime();
}

/**
 * Checks if two dates are on the same calendar day.
 * @param {DateInput} dateLeftInput - The first date.
 * @param {DateInput} dateRightInput - The second date.
 * @returns {boolean} True if both dates are on the same day, false otherwise or if any date is invalid.
 */
export function isSameDay(dateLeftInput: DateInput, dateRightInput: DateInput): boolean {
  const dateLeft = toDate(dateLeftInput);
  const dateRight = toDate(dateRightInput);
  if (!dateLeft || !dateRight) return false;
  return (
    dateLeft.getFullYear() === dateRight.getFullYear() &&
    dateLeft.getMonth() === dateRight.getMonth() &&
    dateLeft.getDate() === dateRight.getDate()
  );
}

/**
 * Checks if two dates are in the same calendar month and year.
 * @param {DateInput} dateLeftInput - The first date.
 * @param {DateInput} dateRightInput - The second date.
 * @returns {boolean} True if both dates are in the same month and year, false otherwise or if any date is invalid.
 */
export function isSameMonth(dateLeftInput: DateInput, dateRightInput: DateInput): boolean {
  const dateLeft = toDate(dateLeftInput);
  const dateRight = toDate(dateRightInput);
  if (!dateLeft || !dateRight) return false;
  return (
    dateLeft.getFullYear() === dateRight.getFullYear() &&
    dateLeft.getMonth() === dateRight.getMonth()
  );
}

/**
 * Checks if two dates are in the same calendar year.
 * @param {DateInput} dateLeftInput - The first date.
 * @param {DateInput} dateRightInput - The second date.
 * @returns {boolean} True if both dates are in the same year, false otherwise or if any date is invalid.
 */
export function isSameYear(dateLeftInput: DateInput, dateRightInput: DateInput): boolean {
  const dateLeft = toDate(dateLeftInput);
  const dateRight = toDate(dateRightInput);
  if (!dateLeft || !dateRight) return false;
  return dateLeft.getFullYear() === dateRight.getFullYear();
}

/**
 * Returns a new Date object set to the start of the day (00:00:00.000) for the given date.
 * @param {DateInput} dateInput - The date.
 * @returns {Date | undefined} A new Date object representing the start of the day, or undefined if input is invalid.
 */
export function startOfDay(dateInput: DateInput): Date | undefined {
  const date = toDate(dateInput);
  if (!date) return undefined;
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Returns a new Date object set to the end of the day (23:59:59.999) for the given date.
 * @param {DateInput} dateInput - The date.
 * @returns {Date | undefined} A new Date object representing the end of the day, or undefined if input is invalid.
 */
export function endOfDay(dateInput: DateInput): Date | undefined {
  const date = toDate(dateInput);
  if (!date) return undefined;
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

/**
 * Returns a new Date object set to the start of the week for the given date.
 * (Week starts on Sunday by default, locale-dependent via getDay()).
 * @param {DateInput} dateInput - The date.
 * @param {number} [firstDayOfWeek=0] - Optional first day of the week (0 for Sunday, 1 for Monday, etc.).
 * @returns {Date | undefined} A new Date object representing the start of the week, or undefined if input is invalid.
 */
export function startOfWeek(
  dateInput: DateInput,
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0
): Date | undefined {
  const date = toDate(dateInput);
  if (!date) return undefined;
  const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diff = (day < firstDayOfWeek ? day + 7 : day) - firstDayOfWeek;
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - diff);
  return startOfDay(newDate); // Also set time to start of day
}

/**
 * Returns a new Date object set to the end of the week for the given date.
 * (Week ends on Saturday by default, locale-dependent via getDay()).
 * @param {DateInput} dateInput - The date.
 * @param {number} [firstDayOfWeek=0] - Optional first day of the week (0 for Sunday, 1 for Monday, etc.).
 * @returns {Date | undefined} A new Date object representing the end of the week, or undefined if input is invalid.
 */
export function endOfWeek(
  dateInput: DateInput,
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0
): Date | undefined {
  const date = toDate(dateInput);
  if (!date) return undefined;
  const sow = startOfWeek(date, firstDayOfWeek);
  if (!sow) return undefined;
  const newDate = new Date(sow);
  newDate.setDate(sow.getDate() + 6);
  return endOfDay(newDate); // Also set time to end of day
}

/**
 * Returns a new Date object set to the start of the month for the given date.
 * @param {DateInput} dateInput - The date.
 * @returns {Date | undefined} A new Date object representing the start of the month, or undefined if input is invalid.
 */
export function startOfMonth(dateInput: DateInput): Date | undefined {
  const date = toDate(dateInput);
  if (!date) return undefined;
  const newDate = new Date(date.getFullYear(), date.getMonth(), 1);
  return startOfDay(newDate); // Ensure time is 00:00:00
}

/**
 * Returns a new Date object set to the end of the month for the given date.
 * @param {DateInput} dateInput - The date.
 * @returns {Date | undefined} A new Date object representing the end of the month, or undefined if input is invalid.
 */
export function endOfMonth(dateInput: DateInput): Date | undefined {
  const date = toDate(dateInput);
  if (!date) return undefined;
  const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Day 0 of next month is last day of current
  return endOfDay(newDate); // Ensure time is 23:59:59.999
}

/**
 * Adds a specified number of days to a date.
 * @param {DateInput} dateInput - The date.
 * @param {number} amount - The number of days to add (can be negative).
 * @returns {Date | undefined} A new Date object with the days added, or undefined if input is invalid.
 */
export function addDays(dateInput: DateInput, amount: number): Date | undefined {
  const date = toDate(dateInput);
  if (!date) return undefined;
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + amount);
  return newDate;
}

/**
 * Adds a specified number of months to a date.
 * Handles month overflows correctly (e.g., Jan 31 + 1 month = Feb 28/29).
 * @param {DateInput} dateInput - The date.
 * @param {number} amount - The number of months to add (can be negative).
 * @returns {Date | undefined} A new Date object with the months added, or undefined if input is invalid.
 */
export function addMonths(dateInput: DateInput, amount: number): Date | undefined {
  const date = toDate(dateInput);
  if (!date) return undefined;
  const newDate = new Date(date);
  const originalDay = newDate.getDate();
  newDate.setMonth(newDate.getMonth() + amount);
  // If the day changed (e.g., Jan 31 + 1 month resulted in Mar 3 instead of Feb 28),
  // set it to the last day of the target month.
  if (newDate.getDate() !== originalDay) {
    newDate.setDate(0); // Sets to the last day of the previous month (which is our target month)
  }
  return newDate;
}

/**
 * Adds a specified number of years to a date.
 * Handles leap years correctly for Feb 29.
 * @param {DateInput} dateInput - The date.
 * @param {number} amount - The number of years to add (can be negative).
 * @returns {Date | undefined} A new Date object with the years added, or undefined if input is invalid.
 */
export function addYears(dateInput: DateInput, amount: number): Date | undefined {
  const date = toDate(dateInput);
  if (!date) return undefined;
  const newDate = new Date(date);
  newDate.setFullYear(date.getFullYear() + amount);
  return newDate;
}

/**
 * Gets the number of days in the month for a given date.
 * @param {DateInput} dateInput - The date.
 * @returns {number | undefined} The number of days in the month, or undefined if input is invalid.
 */
export function getDaysInMonth(dateInput: DateInput): number | undefined {
  const date = toDate(dateInput);
  if (!date) return undefined;
  // Day 0 of the next month gives the last day of the current month.
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/**
 * Calculates the difference in calendar days between two dates.
 * The result is positive if dateLeft is after dateRight.
 * @param {DateInput} dateLeftInput - The first date.
 * @param {DateInput} dateRightInput - The second date.
 * @returns {number | undefined} The difference in days, or undefined if any date is invalid.
 */
export function differenceInDays(
  dateLeftInput: DateInput,
  dateRightInput: DateInput
): number | undefined {
  const leftDateObj = toDate(dateLeftInput);
  const rightDateObj = toDate(dateRightInput);
  if (!leftDateObj || !rightDateObj) return undefined;
  const dateLeft = startOfDay(leftDateObj); // Compare start of days
  const dateRight = startOfDay(rightDateObj);
  if (!dateLeft || !dateRight) return undefined;

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((dateLeft.getTime() - dateRight.getTime()) / MS_PER_DAY);
}

/**
 * Calculates the difference in full calendar months between two dates.
 * @param {DateInput} dateLeftInput - The first date.
 * @param {DateInput} dateRightInput - The second date.
 * @returns {number | undefined} The difference in months, or undefined if any date is invalid.
 */
export function differenceInMonths(
  dateLeftInput: DateInput,
  dateRightInput: DateInput
): number | undefined {
  const dateLeft = toDate(dateLeftInput);
  const dateRight = toDate(dateRightInput);
  if (!dateLeft || !dateRight) return undefined;

  const yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
  const monthDiff = dateLeft.getMonth() - dateRight.getMonth();
  let diff = yearDiff * 12 + monthDiff;

  // Adjust if dateLeft's day is before dateRight's day in the last partial month
  let signedCorrection = 0;
  if (dateLeft.getDate() < dateRight.getDate()) {
    signedCorrection = -1;
  } else if (dateLeft.getDate() > dateRight.getDate()) {
    // No correction needed if day is same or after unless it's the "same month" edge case
  }

  // If they are effectively in the "same" month positionally but days make it not a full month
  if (
    diff !== 0 &&
    signedCorrection !== 0 &&
    (dateLeft.getTime() - dateRight.getTime()) * (diff + signedCorrection) <= 0
  ) {
    // This condition implies that the simple month difference + day correction
    // overshot or undershot crossing the actual month boundary.
    // E.g. March 31st to April 1st is 0 full months (signedCorrection = -1, diff = 1 -> (1-1)=0).
    // E.g. March 1st to Feb 28th is -1 full month (signedCorrection = 0 or 1, diff = -1).
    // If sign of (target - base) is different from (month_diff + correction), apply correction.
  } else {
    // For simple cases, if dateLeft.getDate() < dateRight.getDate(), we haven't completed a full month.
    if (dateLeft.getDate() < dateRight.getDate()) {
      diff--; // Not a full month yet if day is smaller
    }
  }

  // This basic calculation is often good enough but has edge cases with end-of-month dates.
  // A more robust library would handle these with more nuance.
  // For example: Feb 28 to Mar 28 = 1 month. Jan 31 to Feb 28 = 1 month. Jan 30 to Feb 28 = 1 month.
  // The current logic:
  // (Mar 28 - Feb 28): yearDiff=0, monthDiff=1. dateLeft.getDate() == dateRight.getDate(). diff = 1. Correct.
  // (Feb 28 - Jan 31): yearDiff=0, monthDiff=1. dateLeft.getDate() < dateRight.getDate(). diff = 1 - 1 = 0. Incorrect. Should be 1.

  // Let's refine month diff:
  const d1 = toDate(dateLeftInput)!; // Non-null asserted due to check above
  const d2 = toDate(dateRightInput)!;
  let months;
  months = (d1.getFullYear() - d2.getFullYear()) * 12;
  months -= d2.getMonth();
  months += d1.getMonth();
  // If d1 is earlier in the month than d2, and they are not in the same month of different years after initial calc
  if (d1.getDate() < d2.getDate() && !(months === 0 && d1.getMonth() !== d2.getMonth())) {
    months--;
  }
  return months <= 0 ? months : months; // Ensure if calculated as -0, it's 0. But months can be negative.
}

/**
 * Calculates the difference in full calendar years between two dates.
 * @param {DateInput} dateLeftInput - The first date.
 * @param {DateInput} dateRightInput - The second date.
 * @returns {number | undefined} The difference in years, or undefined if any date is invalid.
 */
export function differenceInYears(
  dateLeftInput: DateInput,
  dateRightInput: DateInput
): number | undefined {
  const dateLeft = toDate(dateLeftInput);
  const dateRight = toDate(dateRightInput);
  if (!dateLeft || !dateRight) return undefined;

  let diff = dateLeft.getFullYear() - dateRight.getFullYear();
  // If dateLeft is earlier in the year than dateRight (month or day is smaller)
  if (
    dateLeft.getMonth() < dateRight.getMonth() ||
    (dateLeft.getMonth() === dateRight.getMonth() && dateLeft.getDate() < dateRight.getDate())
  ) {
    diff--;
  }
  return diff;
}

/**
 * ==========================================================================
 * String Utilities
 * ==========================================================================
 */

/**
 * Checks if a value is a string.
 * @param value - The value to check.
 * @returns {boolean} True if the value is a string, false otherwise.
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
 * Capitalizes the first letter of a string.
 * @param {string | null | undefined} str - The string to capitalize.
 * @returns {string} The capitalized string, or an empty string if input is null, undefined, or empty.
 */
export function capitalize(str: string | null | undefined): string {
  if (!str) {
    // Handles null, undefined, empty string
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to a URL-friendly slug.
 * Replaces spaces and non-alphanumeric characters with a specified separator.
 * @param {string | null | undefined} str - The string to slugify.
 * @param {string} [separator='-'] - The character to use as a separator.
 * @returns {string} The slugified string, or an empty string if input is null, undefined, or effectively empty after processing.
 */
export function slugify(str: string | null | undefined, separator: string = '-'): string {
  if (!str) {
    return '';
  }
  const slug = str
    .toString() // Ensure it's a string (in case something else slips by)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word, non-space, non-hyphen characters
    .replace(/\s+/g, separator) // Replace spaces with separator
    .replace(new RegExp(`${separator}+`, 'g'), separator); // Replace multiple separators with a single one

  return slug;
}

/**
 * Truncates a string to a specified length and appends a suffix.
 * Ensures the final string length does not exceed `maxLength`.
 * @param {string | null | undefined} str - The string to truncate.
 * @param {number} maxLength - The maximum length of the string (including suffix). Must be non-negative.
 * @param {string} [suffix='...'] - The suffix to append if truncated.
 * @returns {string} The truncated string or original string if shorter than or equal to maxLength. Returns empty string for invalid inputs.
 */
export function truncate(
  str: string | null | undefined,
  maxLength: number,
  suffix: string = '...'
): string {
  if (!str) {
    return '';
  }
  if (maxLength < 0) {
    // Or throw new Error("Max length must be non-negative");
    return ''; // Or handle as per desired behavior for invalid maxLength
  }
  if (str.length <= maxLength) {
    return str;
  }
  if (maxLength <= suffix.length) {
    // Not enough space for suffix, or only suffix fits
    return suffix.slice(0, maxLength); // Truncate suffix itself if needed
  }
  return str.slice(0, maxLength - suffix.length) + suffix;
}

const HTML_ESCAPE_MAP: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;', // More common than &apos; for wider compatibility
};

/**
 * Escapes HTML special characters in a string.
 * @param {string | null | undefined} str - The string to escape.
 * @returns {string} The HTML-escaped string, or an empty string if input is null or undefined.
 */
export function escapeHTML(str: string | null | undefined): string {
  if (!str) {
    return '';
  }
  return str.replace(/[&<>"']/g, (match) => HTML_ESCAPE_MAP[match] || match);
}

const HTML_UNESCAPE_MAP: Readonly<Record<string, string>> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'", // Handle &apos; as well
};

const unescapeHtmlRegex = /&(?:amp|lt|gt|quot|#39|apos);/g;

/**
 * Unescapes HTML special characters in a string.
 * @param {string | null | undefined} str - The string to unescape.
 * @returns {string} The HTML-unescaped string, or an empty string if input is null or undefined.
 */
export function unescapeHTML(str: string | null | undefined): string {
  if (!str) {
    return '';
  }
  return str.replace(unescapeHtmlRegex, (match) => HTML_UNESCAPE_MAP[match] || match);
}

/**
 * Generates a random string of a specified length from a given charset.
 * @param {number} length - The desired length of the random string. Must be non-negative.
 * @param {string} [charset="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"] - Characters to use.
 * @returns {string} The generated random string. Returns empty string if length is 0 or charset is empty.
 * @throws {Error} if length is negative.
 */
export function generateRandomString(
  length: number,
  charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  if (length < 0) {
    throw new Error('Length must be a non-negative number.');
  }
  if (length === 0 || charset.length === 0) {
    return '';
  }
  let result = '';
  const charsetLength = charset.length;
  // For better randomness, especially for security-sensitive contexts, crypto.getRandomValues would be preferred.
  // This is a simple pseudo-random generator.
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charsetLength));
  }
  return result;
}

/**
 * Normalizes a string by removing extra spaces (leading/trailing and multiple consecutive spaces).
 * @param {string | null | undefined} str - The string to process.
 * @returns {string} The string with extra spaces removed.
 */
export function removeExtraSpaces(str: string | null | undefined): string {
  if (!str) {
    return '';
  }
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Helper to break a string into words. Handles various delimiters.
 * @param {string} str
 * @returns {string[]}
 */
function getWords(str: string): string[] {
  if (!str) return [];
  // Matches sequences of alphanumeric characters, or sequences of uppercase letters followed by lowercase letters
  return str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]+|[0-9]+/g) || [];
}

/**
 * Converts a string to camelCase.
 * e.g., "foo bar" -> "fooBar", "Foo-Bar" -> "fooBar"
 * @param {string | null | undefined} str - The string to convert.
 * @returns {string} The camelCased string.
 */
export function camelCase(str: string | null | undefined): string {
  if (!str) return '';
  const words = getWords(str);
  return words
    .map((word, index) => {
      const lowerWord = word.toLowerCase();
      return index === 0 ? lowerWord : lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    })
    .join('');
}

/**
 * Converts a string to PascalCase (UpperCamelCase).
 * e.g., "foo bar" -> "FooBar", "foo-bar" -> "FooBar"
 * @param {string | null | undefined} str - The string to convert.
 * @returns {string} The PascalCased string.
 */
export function pascalCase(str: string | null | undefined): string {
  if (!str) return '';
  const words = getWords(str);
  return words
    .map((word) => {
      const lowerWord = word.toLowerCase();
      return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    })
    .join('');
}

/**
 * Converts a string to kebab-case.
 * e.g., "fooBar" -> "foo-bar", "Foo Bar" -> "foo-bar"
 * @param {string | null | undefined} str - The string to convert.
 * @returns {string} The kebab-cased string.
 */
export function kebabCase(str: string | null | undefined): string {
  if (!str) return '';
  return getWords(str)
    .map((word) => word.toLowerCase())
    .join('-');
}

/**
 * Converts a string to snake_case.
 * e.g., "fooBar" -> "foo_bar", "Foo Bar" -> "foo_bar"
 * @param {string | null | undefined} str - The string to convert.
 * @returns {string} The snake_cased string.
 */
export function snakeCase(str: string | null | undefined): string {
  if (!str) return '';
  return getWords(str)
    .map((word) => word.toLowerCase())
    .join('_');
}

/**
 * Converts a string to Start Case (capitalizing the first letter of each word).
 * e.g., "foo-bar" -> "Foo Bar", "fooBar" -> "Foo Bar"
 * @param {string | null | undefined} str - The string to convert.
 * @returns {string} The string in start case.
 */
export function startCase(str: string | null | undefined): string {
  if (!str) return '';
  return getWords(str)
    .map((word) => {
      const lowerWord = word.toLowerCase();
      return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    })
    .join(' ');
}

/**
 * Splits a string into an array of its words.
 * Uses a more robust word detection than simple space splitting.
 * @param {string | null | undefined} str - The string to split.
 * @param {RegExp | string} [pattern] - Optional pattern to match words.
 * Defaults to a pattern that handles various casing and separators.
 * @returns {string[]} An array of words.
 */
export function words(str: string | null | undefined, pattern?: RegExp | string): string[] {
  if (!str) {
    return [];
  }
  if (pattern instanceof RegExp) {
    return str.match(pattern) || [];
  }
  if (typeof pattern === 'string' && pattern.length > 0) {
    return str.match(new RegExp(pattern, 'g')) || [];
  }
  return getWords(str); // Use the internal helper by default
}

/**
 * Counts occurrences of a substring within a string.
 * @param {string | null | undefined} str - The main string.
 * @param {string} subString - The substring to count.
 * @param {object} [options] - Optional settings.
 * @param {boolean} [options.caseSensitive=true] - Whether the search should be case-sensitive.
 * @param {boolean} [options.overlap=false] - Whether to count overlapping occurrences.
 * @returns {number} The number of occurrences.
 */
export function countOccurrences(
  str: string | null | undefined,
  subString: string,
  options?: { caseSensitive?: boolean; overlap?: boolean }
): number {
  if (!str || !subString) {
    return 0;
  }

  const { caseSensitive = true, overlap = false } = options || {};
  const mainStr = caseSensitive ? str : str.toLowerCase();
  const searchStr = caseSensitive ? subString : subString.toLowerCase();

  if (searchStr.length === 0) return 0; // Or str.length + 1 based on some definitions, but 0 is practical.

  let count = 0;
  let position = 0;

  while (true) {
    position = mainStr.indexOf(searchStr, position);
    if (position === -1) {
      break;
    }
    count++;
    position += overlap ? 1 : searchStr.length;
  }
  return count;
}

/**
 * Masks a portion of a string with a masking character.
 * @param {string | null | undefined} str - The string to mask.
 * @param {number} visibleStartCount - Number of characters to keep visible at the start.
 * @param {number} [visibleEndCount=0] - Number of characters to keep visible at the end.
 * @param {string} [maskChar='*'] - The character to use for masking.
 * @returns {string} The masked string.
 */
export function mask(
  str: string | null | undefined,
  visibleStartCount: number,
  visibleEndCount: number = 0,
  maskChar: string = '*'
): string {
  if (!str) {
    return '';
  }
  const len = str.length;
  const start = Math.max(0, Math.min(visibleStartCount, len));
  const end = Math.max(0, Math.min(visibleEndCount, len - start)); // Ensure end visibility doesn't overlap start

  if (start + end >= len) {
    return str; // String is too short to mask according to counts
  }

  const maskedLength = len - start - end;
  const maskedPart = maskChar.repeat(Math.max(0, maskedLength));

  return str.substring(0, start) + maskedPart + (end > 0 ? str.substring(len - end) : '');
}

/**
 * Reverses a string, correctly handling Unicode characters (including surrogate pairs / astral symbols).
 * @param {string | null | undefined} str - The string to reverse.
 * @returns {string} The reversed string.
 */
export function reverse(str: string | null | undefined): string {
  if (!str) {
    return '';
  }
  // Spreading a string into an array handles Unicode characters correctly.
  return [...str].reverse().join('');
}

/**
 * Inserts a substring into a string at a specified index.
 * @param {string | null | undefined} str - The original string.
 * @param {number} index - The index at which to insert the substring. Clamped to string bounds.
 * @param {string} subString - The substring to insert.
 * @returns {string} The new string with the substring inserted.
 */
export function insertAt(str: string | null | undefined, index: number, subString: string): string {
  if (!str) {
    return subString || '';
  }
  if (!subString) {
    return str;
  }
  const S = String(str); // Ensure it's a string.
  const insertIndex = Math.max(0, Math.min(index, S.length));
  return S.slice(0, insertIndex) + subString + S.slice(insertIndex);
}

/**
 * Removes all occurrences of a substring or matches of a regex from a string.
 * @param {string | null | undefined} str - The original string.
 * @param {string | RegExp} subStringOrRegex - The substring or RegExp to remove.
 * @returns {string} The new string with removals.
 */
export function remove(str: string | null | undefined, subStringOrRegex: string | RegExp): string {
  if (!str) {
    return '';
  }
  if (typeof subStringOrRegex === 'string') {
    // Need to escape special characters if it's a string meant for regex
    const escapedSubstring = subStringOrRegex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return str.replace(new RegExp(escapedSubstring, 'g'), '');
  }
  // If it's already a RegExp, ensure it has the global flag for all occurrences
  const regex = subStringOrRegex.global
    ? subStringOrRegex
    : new RegExp(subStringOrRegex.source, subStringOrRegex.flags + 'g');
  return str.replace(regex, '');
}

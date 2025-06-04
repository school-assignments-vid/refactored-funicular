/**
 * ==========================================================================
 * Miscellaneous Utilities (Fully TypeScript Support)
 * ==========================================================================
 */

/**
 * A generic function type.
 */
type AnyFunction<R = any> = (...args: any[]) => R;

/**
 * Generates a UUID v4 (Universally Unique Identifier).
 * This is a pseudo-random UUID. For cryptographically secure UUIDs, prefer `crypto.randomUUID()` when available.
 * @returns {string} A UUID v4 string.
 */
export function uuidv4(): string {
  // If crypto.randomUUID is available, use it for better randomness and security
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback to pseudo-random generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const randomNumber = (Math.random() * 16) | 0;
    const value = char === 'x' ? randomNumber : (randomNumber & 0x3) | 0x8;
    return value.toString(16);
  });
}

/**
 * Fallback method for copyToClipboard using execCommand (deprecated).
 * @param {string} text - The text to copy.
 * @returns {Promise<void>}
 * @private
 */
function copyToClipboardExecCommand(text: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Styling to make it invisible and out of layout
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', ''); // Prevent keyboard popup on mobile

    document.body.appendChild(textArea);
    textArea.select(); // Select the text
    textArea.setSelectionRange(0, textArea.value.length); // For mobile Safari

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        resolve();
      } else {
        reject(new Error('Copying text command was unsuccessful using execCommand.'));
      }
    } catch (err) {
      reject(err instanceof Error ? err : new Error(`Fallback: Unable to copy: ${String(err)}`));
    } finally {
      document.body.removeChild(textArea);
    }
  });
}

/**
 * Attempts to copy a string to the clipboard.
 * Uses the modern Clipboard API (navigator.clipboard.writeText) if available in a secure context,
 * with a fallback to the older execCommand method.
 * Note: Clipboard API usually requires a secure context (HTTPS) and user permission.
 * @param {string} text - The text to copy.
 * @returns {Promise<void>} A promise that resolves when copy is successful, or rejects on failure.
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (typeof text !== 'string') {
    return Promise.reject(new TypeError('Text to copy must be a string.'));
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // console.error("Failed to copy text using navigator.clipboard: ", err);
      // Attempt fallback if navigator.clipboard.writeText fails (e.g. not focused, permissions)
      try {
        await copyToClipboardExecCommand(text);
      } catch (fallbackErr) {
        // If both methods fail, reject with a consolidated error or the specific fallback error
        const finalError = err instanceof Error ? err : new Error(String(err));
        finalError.message = `Clipboard API failed: ${
          finalError.message
        }. Fallback execCommand also failed: ${
          fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr)
        }`;
        return Promise.reject(finalError);
      }
    }
  } else if (typeof document !== 'undefined' && typeof document.execCommand === 'function') {
    // If Clipboard API is not available, try execCommand directly.
    try {
      await copyToClipboardExecCommand(text);
    } catch (err) {
      return Promise.reject(err instanceof Error ? err : new Error(String(err)));
    }
  } else {
    return Promise.reject(new Error('Clipboard operations are not supported in this environment.'));
  }
}

// --- Type Checking Utilities ---

/**
 * Checks if a value is defined (not null or undefined).
 * @template T
 * @param {T | undefined | null} value - The value to check.
 * @returns {value is T} True if the value is defined, false otherwise.
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

/**
 * Checks if a value is undefined.
 * @param value - The value to check.
 * @returns {value is undefined} True if the value is undefined, false otherwise.
 */
export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined';
}

/**
 * Checks if a value is null.
 * @param value - The value to check.
 * @returns {value is null} True if the value is null, false otherwise.
 */
export function isNull(value: any): value is null {
  return value === null;
}

/**
 * Checks if a value is a boolean.
 * @param value - The value to check.
 * @returns {value is boolean} True if the value is a boolean, false otherwise.
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Checks if a value is a function.
 * @param value - The value to check.
 * @returns {value is Function} True if the value is a function, false otherwise.
 */
export function isFunction(value: any): value is AnyFunction {
  return typeof value === 'function';
}

/**
 * Checks if a value is a RegExp object.
 * @param value - The value to check.
 * @returns {value is RegExp} True if the value is a RegExp, false otherwise.
 */
export function isRegExp(value: any): value is RegExp {
  return value instanceof RegExp;
}

/**
 * Checks if a value is an Error object.
 * @param value - The value to check.
 * @returns {value is Error} True if the value is an Error, false otherwise.
 */
export function isError(value: any): value is Error {
  return value instanceof Error;
}

/**
 * Checks if a value is a Promise.
 * This is a basic check for a thenable object.
 * @template T
 * @param value - The value to check.
 * @returns {value is Promise<T>} True if the value appears to be a Promise, false otherwise.
 */
export function isPromise<T = any>(value: any): value is Promise<T> {
  return value != null && typeof value.then === 'function' && typeof value.catch === 'function';
}

/**
 * Checks if a value is iterable (has a Symbol.iterator method).
 * @template T
 * @param value - The value to check.
 * @returns {value is Iterable<T>} True if the value is iterable, false otherwise.
 */
export function isIterable<T = any>(value: any): value is Iterable<T> {
  return value != null && typeof value[Symbol.iterator] === 'function';
}

/**
 * Checks if a value is considered "empty".
 * Empty means:
 * - null or undefined
 * - Empty string ""
 * - Empty array []
 * - Empty object {} (no own enumerable properties)
 * - Empty Map or Set (size 0)
 * - Number 0 or boolean false are NOT considered empty by this function.
 * @param value - The value to check.
 * @returns {boolean} True if the value is empty, false otherwise.
 */
export function isEmpty(value: any): boolean {
  if (value == null) {
    // Handles null and undefined
    return true;
  }
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }
  if (typeof value === 'object') {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        return false;
      }
    }
    return true;
  }
  return false; // Numbers, booleans, functions are not considered empty by this definition
}

// --- Functional Utilities ---

/**
 * A function that does nothing.
 */
export function noop(): void {
  /* do nothing */
}

/**
 * Returns the first argument it receives.
 * @template T
 * @param {T} value - The value to return.
 * @returns {T} The input value.
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * Creates a function that is restricted to invoking func once.
 * Repeat calls to the function return the value of the first invocation.
 * @template F - The type of the function.
 * @param {F} func - The function to restrict.
 * @returns {F} The new
 */
export function once<F extends AnyFunction>(func: F): F {
  let ran = false;
  let result: ReturnType<F>;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>): ReturnType<F> {
    if (ran) {
      return result;
    }
    ran = true;
    result = func.apply(this, args);
    return result;
  } as F;
}

let _uniqueIdCounter = 0;
/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 * Uses a simple incrementing counter. Not suitable for globally unique IDs across systems.
 * @param {string} [prefix='id_'] - The prefix for the ID.
 * @returns {string} A unique ID string.
 */
export function uniqueId(prefix: string = 'id_'): string {
  _uniqueIdCounter++;
  return prefix + _uniqueIdCounter;
}

// --- URL Utilities ---

/**
 * Parses a URL string and returns a URL object.
 * @param {string} urlString - The URL string to parse.
 * @param {string} [base] - Optional base URL if urlString is a relative URL.
 * @returns {URL | undefined} The URL object, or undefined if parsing fails.
 */
export function parseUrl(urlString: string, base?: string): URL | undefined {
  try {
    return new URL(urlString, base);
  } catch (e) {
    return undefined;
  }
}

/**
 * Gets query parameters from a URL string or the current window location as an object.
 * Handles multiple values for the same key by returning an array of strings.
 * @param {string} [url] - Optional URL string. Defaults to `window.location.href` if in a browser.
 * @returns {Record<string, string | string[]>} An object of query parameters.
 */
export function getQueryParams(url?: string): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};
  let search: string | undefined;

  if (url) {
    const parsed = parseUrl(url);
    search = parsed?.search;
  } else if (typeof window !== 'undefined' && window.location) {
    search = window.location.search;
  }

  if (!search) {
    return params;
  }

  const urlSearchParams = new URLSearchParams(search);
  urlSearchParams.forEach((value, key) => {
    const existing = params[key];
    if (existing) {
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        params[key] = [existing, value];
      }
    } else {
      params[key] = value;
    }
  });
  return params;
}

/**
 * Adds query parameters to a URL string.
 * Encodes parameter values.
 * @param {string} url - The base URL string.
 * @param {Record<string, string | number | boolean | null | undefined>} params - An object of parameters to add. Null or undefined values are ignored.
 * @returns {string} The URL string with added query parameters.
 */
export function addQueryParams(
  url: string,
  params: Record<string, string | number | boolean | null | undefined>
): string {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const parsedUrl = parseUrl(url);
  if (!parsedUrl) {
    // Cannot parse base URL, try to append naively but this might be problematic
    const queryString = Object.entries(params)
      .filter(([, value]) => value != null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    return url + (url.includes('?') ? '&' : '?') + queryString;
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      // Ignore null or undefined values
      parsedUrl.searchParams.set(key, String(value));
    }
  });
  return parsedUrl.toString();
}

// --- Environment Utilities ---

/**
 * Checks if the current environment is a browser.
 * @returns {boolean} True if in a browser environment, false otherwise.
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Checks if localStorage is supported and available.
 * @returns {boolean}
 */
export function supportsLocalStorage(): boolean {
  if (!isBrowser()) return false;
  try {
    const testKey = '__localStorageTest__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Checks if sessionStorage is supported and available.
 * @returns {boolean}
 */
export function supportsSessionStorage(): boolean {
  if (!isBrowser()) return false;
  try {
    const testKey = '__sessionStorageTest__';
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// --- Other ---

/**
 * A safer way to check for own properties.
 * @param obj The object to check.
 * @param prop The property key to check for.
 * @returns True if the object has the specified property as its own.
 */
export function hasOwnProperty<T extends object, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> {
  // Type predicate helps with narrowing
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
 * Utility to try executing a function and catch any errors, optionally running an error handler.
 * @template T The expected return type of the function `fn`.
 * @param {() => T} fn - The function to try executing.
 * @param {(error: any) => T | void} [errorHandler] - Optional function to handle errors. It can return a fallback value or nothing.
 * @returns {T | undefined} The result of `fn`, or the result of `errorHandler`, or undefined if `fn` throws and no `errorHandler` provides a value.
 */
export function tryCatch<T>(fn: () => T, errorHandler?: (error: any) => T | void): T | undefined {
  try {
    return fn();
  } catch (error) {
    if (errorHandler) {
      const result = errorHandler(error);
      // If errorHandler returns void (undefined implicitly), result will be undefined
      // If errorHandler returns a value of type T, that will be returned
      return result as T | undefined;
    }
    // console.error("Error in tryCatch:", error); // Optional: log unhandled errors
    return undefined;
  }
}

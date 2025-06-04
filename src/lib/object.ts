/**
 * ==========================================================================
 * Object Utilities
 * ==========================================================================
 */

/**
 * A general type for objects with string keys.
 */
export type PlainObject<V = any> = Record<string, V>;

/**
 * A general type for objects with any property key.
 */
export type AnyObject<V = any> = Record<PropertyKey, V>;

/**
 * Checks if a value is a "plain" object (created by {} or new Object()).
 * @param value - The value to check.
 * @returns {boolean} True if the value is a plain object, false otherwise.
 */
export function isPlainObject(value: any): value is PlainObject {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  // Check for objects created by `new Object()` or `{}`
  // For objects created with `Object.create(null)`, `getPrototypeOf` returns null.
  // For typical plain objects, the prototype is `Object.prototype`.
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Checks if an object has no own enumerable string-keyed properties.
 * Note: Returns true for null, undefined, primitives, and arrays (as they don't have own enumerable string-keyed properties in the way plain objects do,
 * or for an empty array specifically, it has no enumerable own properties).
 * For a stricter check on whether a plain object itself is empty, combine with `isPlainObject`.
 *
 * @param value - The value to check.
 * @returns {boolean} True if the value has no own enumerable string-keyed properties, false otherwise.
 */
export function hasNoOwnEnumerableProperties(value: any): boolean {
  if (value == null || typeof value !== 'object') {
    // null, undefined, primitives
    return true;
  }
  // For arrays, for...in iterates indices if they have values, which are own properties.
  // An empty array has no such properties. A non-empty array would return false.
  // This aligns with checking for *any* own enumerable property.
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

/**
 * A more specific check to see if a plain object is empty (has no own enumerable properties).
 * @param obj - The object to check.
 * @returns {boolean} True if the object is a plain object and is empty, false otherwise.
 */
export function isEmptyPlainObject(obj: any): boolean {
  return isPlainObject(obj) && hasNoOwnEnumerableProperties(obj);
}

/**
 * Creates a deep clone of a value.
 * Handles primitives, dates, arrays, plain objects, Set, and Map.
 * - Functions are copied by reference.
 * - RegExp objects are cloned into new RegExp objects.
 * - Class instances are cloned into plain objects, losing their class identity and methods (structural clone).
 * - Does not handle cyclic references (will lead to infinite recursion).
 * For more complex scenarios (cyclic refs, full class instance cloning), consider a dedicated library like Lodash's cloneDeep or structuredClone (if available).
 *
 * @template T
 * @param {T} value - The value to clone.
 * @returns {T} The deep cloned value. Type T is returned, but be mindful of the limitations for complex objects.
 */
export function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value; // Primitives or null
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as any;
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as any;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as any;
  }

  if (value instanceof Map) {
    const clonedMap = new Map();
    value.forEach((val, key) => {
      clonedMap.set(deepClone(key), deepClone(val));
    });
    return clonedMap as any;
  }

  if (value instanceof Set) {
    const clonedSet = new Set();
    value.forEach((val) => {
      clonedSet.add(deepClone(val));
    });
    return clonedSet as any;
  }

  if (typeof value === 'object') {
    // Handles plain objects and other object types (structurally)
    const clonedObj: PlainObject = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        clonedObj[key] = deepClone((value as PlainObject)[key]);
      }
    }
    return clonedObj as T; // Cast as T, with caveats mentioned above
  }

  return value; // Should not be reached for objects, but as a fallback
}

/**
 * Type for a path segment (string for property name, number for array index).
 */
type PathSegment = string | number;

/**
 * Gets the value at a path of an object. If the resolved value is undefined, the defaultValue is returned.
 * @template TValue - The expected type of the value.
 * @template TObject - The type of the object.
 * @param {TObject} obj - The object to query.
 * @param {PathSegment[] | string} path - The path of the property to get (e.g., 'a.b.c' or ['a', 0, 'b']).
 * @param {TValue} [defaultValue] - The value returned for undefined resolved values.
 * @returns {TValue | undefined} The value at path or defaultValue if path is not found or obj is null/undefined.
 */
export function get<TValue = any, TObject extends AnyObject = AnyObject>(
  obj: TObject | null | undefined,
  path: PathSegment[] | string,
  defaultValue?: TValue
): TValue | undefined {
  if (obj == null) {
    return defaultValue;
  }

  const pathArray = Array.isArray(path) ? path : path.split('.').filter(Boolean); // filter(Boolean) to handle cases like 'a..b'

  let current: any = obj;
  for (let i = 0; i < pathArray.length; i++) {
    const segment = pathArray[i];
    if (current == null || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[segment];
    if (current === undefined && i < pathArray.length - 1) {
      // Path broken before the end
      return defaultValue;
    }
  }

  return current === undefined ? defaultValue : (current as TValue);
}

/**
 * Sets the value at a path of an object. If a portion of the path doesn't exist, it's created.
 * Note: This function mutates the object.
 * @template TObject - The type of the object.
 * @param {TObject} obj - The object to modify.
 * @param {PathSegment[] | string} path - The path of the property to set.
 * @param {*} value - The value to set.
 * @returns {TObject} The object with the value set. Returns the original object if it's not an object or array.
 */
export function set<TObject extends AnyObject>(
  obj: TObject,
  path: PathSegment[] | string,
  value: any
): TObject {
  if (obj == null || typeof obj !== 'object') {
    return obj; // Cannot set path on non-objects
  }

  const pathArray = Array.isArray(path) ? path : path.split('.').filter(Boolean);

  let current: any = obj;
  for (let i = 0; i < pathArray.length; i++) {
    const segment = pathArray[i];
    const isLastSegment = i === pathArray.length - 1;

    if (isLastSegment) {
      current[segment] = value;
    } else {
      if (current[segment] == null || typeof current[segment] !== 'object') {
        // If next segment is a number, create an array, otherwise an object
        current[segment] = typeof pathArray[i + 1] === 'number' ? [] : {};
      }
      current = current[segment];
    }
  }
  return obj;
}

/**
 * Checks if a path is a direct or inherited property of an object.
 * For own properties, use `Object.prototype.hasOwnProperty.call(obj, key)` or check `get(obj, path) !== undefined`.
 * @param {AnyObject | null | undefined} obj - The object to query.
 * @param {PathSegment[] | string} path - The path to check.
 * @returns {boolean} True if the path exists, false otherwise.
 */
export function has(obj: AnyObject | null | undefined, path: PathSegment[] | string): boolean {
  if (obj == null) {
    return false;
  }
  const pathArray = Array.isArray(path) ? path : path.split('.').filter(Boolean);

  let current: any = obj;
  for (const segment of pathArray) {
    if (current == null || typeof current !== 'object' || !(segment in current)) {
      return false;
    }
    current = current[segment];
  }
  // If loop completes, all segments were found. The value at the end of the path might be undefined,
  // but the path itself exists up to that point. This behavior matches lodash _.has.
  return pathArray.length > 0; // Ensure path wasn't empty
}

/**
 * Creates an object composed of the picked object properties.
 * @template T - The type of the source object.
 * @template K - The keys to pick.
 * @param {T} obj - The source object.
 * @param {K[]} keys - An array of keys to pick.
 * @returns {Pick<T, K>} A new object with the picked properties.
 */
export function pick<T extends PlainObject, K extends keyof T>(
  obj: T | null | undefined,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  if (obj == null || !keys || keys.length === 0) {
    return result;
  }
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Creates an object composed of the own enumerable properties of `object` that are not omitted.
 * @template T - The type of the source object.
 * @template K - The keys to omit.
 * @param {T} obj - The source object.
 * @param {K[]} keysToOmit - An array of keys to omit.
 * @returns {Omit<T, K>} A new object with the omitted properties.
 */
export function omit<T extends PlainObject, K extends keyof T>(
  obj: T | null | undefined,
  keysToOmit: K[]
): Omit<T, K> {
  const result = { ...obj } as T; // Start with a shallow clone
  if (obj == null || !keysToOmit || keysToOmit.length === 0) {
    return result as Omit<T, K>; // Return the shallow clone if nothing to omit or invalid obj
  }
  for (const key of keysToOmit) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      delete result[key];
    }
  }
  return result as Omit<T, K>;
}

/**
 * Creates an object with the same keys as `object` and values generated by
 * running each own enumerable string keyed property of `object` thru `iteratee`.
 * @template TInputObject - Type of the input object.
 * @template TOutputValue - Type of the values in the output object.
 * @param {TInputObject} obj - The object to iterate over.
 * @param {(value: TInputObject[keyof TInputObject], key: keyof TInputObject, object: TInputObject) => TOutputValue} iteratee - The function invoked per iteration.
 * @returns {Record<keyof TInputObject, TOutputValue>} A new object with mapped values.
 */
export function mapValues<TInputObject extends PlainObject, TOutputValue>(
  obj: TInputObject | null | undefined,
  iteratee: (
    value: TInputObject[Extract<keyof TInputObject, string>], // Ensure value is from string keys
    key: Extract<keyof TInputObject, string>, // Ensure key is string
    object: TInputObject
  ) => TOutputValue
): Record<Extract<keyof TInputObject, string>, TOutputValue> {
  const result = {} as Record<Extract<keyof TInputObject, string>, TOutputValue>;
  if (obj == null) {
    return result;
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // TypeScript might struggle with `key` directly if TInputObject has non-string keys (e.g. symbols from interfaces)
      // We cast key to string here as for...in deals with enumerable string properties.
      const stringKey = key as Extract<keyof TInputObject, string>;
      result[stringKey] = iteratee(obj[stringKey], stringKey, obj);
    }
  }
  return result;
}

/**
 * Creates an object with keys generated by running each own enumerable string keyed property of `object`
 * thru `iteratee` and values are the original values. If iteratee returns the same key multiple times,
 * the last one will overwrite previous ones.
 * @template TInputObject - Type of the input object.
 * @template TOutputKey - Type of the keys in the output object (string or number).
 * @param {TInputObject} obj - The object to iterate over.
 * @param {(value: TInputObject[keyof TInputObject], key: keyof TInputObject, object: TInputObject) => TOutputKey} iteratee - The function invoked per iteration to generate the new key.
 * @returns {Record<TOutputKey, TInputObject[keyof TInputObject]>} A new object with mapped keys.
 */
export function mapKeys<TInputObject extends PlainObject, TOutputKey extends string | number>(
  obj: TInputObject | null | undefined,
  iteratee: (
    value: TInputObject[Extract<keyof TInputObject, string>],
    key: Extract<keyof TInputObject, string>,
    object: TInputObject
  ) => TOutputKey
): Record<TOutputKey, TInputObject[Extract<keyof TInputObject, string>]> {
  const result = {} as Record<TOutputKey, TInputObject[Extract<keyof TInputObject, string>]>;
  if (obj == null) {
    return result;
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const stringKey = key as Extract<keyof TInputObject, string>;
      const newKey = iteratee(obj[stringKey], stringKey, obj);
      result[newKey] = obj[stringKey];
    }
  }
  return result;
}

/**
 * Performs a simple (shallow) merge of properties from source objects into a target object.
 * It mutates the target object.
 * Properties in later sources will overwrite properties in earlier ones or the target.
 * Does not recursively merge nested objects. For deep merge, see `deepMerge`.
 * @template TTarget - The type of the target object.
 * @param {TTarget} target - The destination object.
 * @param {...any[]} sources - The source objects.
 * @returns {TTarget} The modified target object.
 */
export function merge<TTarget extends AnyObject>(target: TTarget, ...sources: any[]): TTarget {
  if (target == null || typeof target !== 'object') {
    return target; // Or throw error
  }
  for (const source of sources) {
    if (source != null && typeof source === 'object') {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          (target as any)[key] = source[key];
        }
      }
    }
  }
  return target;
}

/**
 * Performs a deep merge of properties from source objects into a target object.
 * It mutates the target object.
 * Nested objects are merged recursively. Arrays are typically overwritten or merged based on specific library implementations (here, arrays from source will overwrite target arrays).
 * @template TTarget - The type of the target object.
 * @param {TTarget} target - The destination object.
 * @param {...any[]} sources - The source objects.
 * @returns {TTarget} The modified target object. (Type is TTarget, but effectively can be a union of TTarget and source types).
 */
export function deepMerge<TTarget extends AnyObject>(target: TTarget, ...sources: any[]): TTarget {
  if (target == null || typeof target !== 'object') {
    return target; // Or throw error
  }

  for (const source of sources) {
    if (source != null && typeof source === 'object') {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          const targetValue = (target as any)[key];
          const sourceValue = source[key];

          if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
            deepMerge(targetValue, sourceValue); // Recurse for plain objects
          } else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            // Simple array merge: concatenate and unique, or overwrite.
            // Here we overwrite for simplicity, like Object.assign.
            // For more complex array merging (e.g., by ID), custom logic is needed.
            (target as any)[key] = deepClone(sourceValue); // Overwrite array with a clone
          } else {
            // For primitives, dates, functions, non-plain objects, or if targetValue is not an object/array
            (target as any)[key] = deepClone(sourceValue); // Assign a clone of the source value
          }
        }
      }
    }
  }
  return target;
}

/**
 * Typed version of Object.keys().
 * @template T - The type of the object.
 * @param {T} obj - The object.
 * @returns {(keyof T)[]} An array of the object's own enumerable string property names.
 */
export function objectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Typed version of Object.values().
 * @template T - The type of the object.
 * @param {T} obj - The object.
 * @returns {T[keyof T][]} An array of the object's own enumerable string property values.
 */
export function objectValues<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][];
}

/**
 * Typed version of Object.entries().
 * @template T - The type of the object.
 * @param {T} obj - The object.
 * @returns {[keyof T, T[keyof T]][]} An array of the object's own enumerable string property [key, value] pairs.
 */
export function objectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

/**
 * Creates an object from an array of key-value pairs.
 * @template V - The type of the values in the object.
 * @param {Array<[PropertyKey, V]>} pairs - An array of [key, value] pairs.
 * @returns {Record<PropertyKey, V>} The new object.
 */
export function fromPairs<V>(
  pairs: Array<[PropertyKey, V]> | null | undefined
): Record<PropertyKey, V> {
  const result: Record<PropertyKey, V> = {};
  if (!pairs) {
    return result;
  }
  for (const [key, value] of pairs) {
    result[key] = value;
  }
  return result;
}

/**
 * ==========================================================================
 * Async Utilities
 * ==========================================================================
 */

// Helper type for timer IDs (NodeJS.Timeout or number for browser)
type TimerId = ReturnType<typeof setTimeout>;

/**
 * A generic function type.
 */
type AnyFunction<R = any> = (...args: any[]) => R;
type AnyAsyncFunction<R = any> = (...args: any[]) => Promise<R>;

/**
 * Debounces a function, delaying its execution until after a certain time has passed
 * since the last time it was invoked.
 * The debounced function comes with a `cancel` method to cancel the pending invocation
 * and a `flush` method to immediately invoke any pending function.
 *
 * @template F - The type of the function to debounce.
 * @param {F} func - The function to debounce.
 * @param {number} delayMs - The delay in milliseconds.
 * @param {object} [options={}] - Options object.
 * @param {boolean} [options.immediate=false] - If true, trigger the function on the leading edge instead of the trailing.
 * @returns {(...args: Parameters<F>) => ReturnType<F> | undefined} The debounced function with `cancel` and `flush` methods.
 * Returns `undefined` if `immediate` is false and called before the delay, or if cancelled.
 * Returns the result of `func` if `immediate` is true or after `flush`.
 */
export interface DebouncedFunction<F extends AnyFunction> {
  (...args: Parameters<F>): ReturnType<F> | undefined;
  cancel: () => void;
  flush: () => ReturnType<F> | undefined;
  pending: () => boolean;
}

export function debounce<F extends AnyFunction>(
  func: F,
  delayMs: number,
  options: { immediate?: boolean } = {}
): DebouncedFunction<F> {
  let timeoutId: TimerId | undefined;
  let lastArgs: Parameters<F> | undefined;
  let lastThis: ThisParameterType<F> | undefined;
  let result: ReturnType<F> | undefined;

  const { immediate = false } = options;

  const later = (
    context: ThisParameterType<F> | undefined,
    args: Parameters<F>
  ): ReturnType<F> | undefined => {
    timeoutId = undefined;
    if (!immediate) {
      result = func.apply(context, args);
      lastArgs = undefined;
      lastThis = undefined;
    }
    if (result === undefined) {
      throw new Error('No result available to return.');
    }
    if (result === undefined) {
      throw new Error('No result available to return.');
    }
    return result;
  };

  const debounced = function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ): ReturnType<F> | undefined {
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this; // `this` is captured for later.apply

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    if (immediate && timeoutId === undefined) {
      // If immediate is true and no timeout is set, call func immediately
      // but still set up a timeout to prevent further calls until delay has passed.
      // The actual result for immediate is returned here.
      result = func.apply(lastThis, lastArgs);
      timeoutId = setTimeout(() => {
        // This timeout is just to enforce the delay window
        timeoutId = undefined; // Reset after delay so next immediate call can happen
      }, delayMs);
    } else {
      // If not immediate, or if immediate but a timeout is already running (within delay window)
      // set up the trailing call.
      result = undefined; // For non-immediate calls, result is from the trailing edge
      timeoutId = setTimeout(() => later(lastThis, lastArgs!), delayMs);
    }
    return result; // For immediate, this is the result. For deferred, this is undefined.
  } as DebouncedFunction<F>;

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = undefined;
    lastArgs = undefined;
    lastThis = undefined;
  };

  debounced.flush = (): ReturnType<F> | undefined => {
    if (timeoutId !== undefined && lastArgs) {
      // If there's a pending non-immediate call, execute it now
      return later(lastThis, lastArgs);
    } else if (immediate && lastArgs) {
      // If it was an immediate call that already fired,
      // re-calling flush shouldn't re-trigger if it's within its cooldown.
      // However, if the intent of flush is to "ensure it has run with latest args",
      // and an immediate call already happened, one might argue it shouldn't re-run.
      // For simplicity, flush for immediate mostly clears pending cooldown.
      // The original result of an immediate call is returned synchronously by the main debounced function.
      // This flush for immediate calls mainly serves to clear any pending timeout and ensure
      // the function's state reflects no pending operations.
    }
    // If no pending non-immediate call, return current/last known result (could be from an immediate call).
    return result;
  };

  debounced.pending = (): boolean => {
    return timeoutId !== undefined;
  };

  return debounced;
}

/**
 * Throttles a function, ensuring it's called at most once within a specified time window.
 * The throttled function comes with a `cancel` method to cancel any pending trailing invocation
 * and a `flush` method to immediately invoke any pending trailing function.
 *
 * @template F - The type of the function to throttle.
 * @param {F} func - The function to throttle.
 * @param {number} limitMs - The time limit in milliseconds.
 * @param {object} [options={}] - Options object.
 * @param {boolean} [options.leading=true] - If true, trigger the function on the leading edge.
 * @param {boolean} [options.trailing=true] - If true, trigger the function on the trailing edge if there were calls during the throttled period.
 * @returns {(...args: Parameters<F>) => ReturnType<F> | undefined} The throttled function.
 */
export interface ThrottledFunction<F extends AnyFunction> {
  (...args: Parameters<F>): ReturnType<F> | undefined;
  cancel: () => void;
  flush: () => ReturnType<F> | undefined;
  pending: () => boolean;
}

export function throttle<F extends AnyFunction>(
  func: F,
  limitMs: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): ThrottledFunction<F> {
  let timeoutId: TimerId | undefined;
  let lastArgs: Parameters<F> | undefined;
  let lastThis: ThisParameterType<F> | undefined;
  let lastCallTime: number = 0;
  let result: ReturnType<F> | undefined;

  const { leading = true, trailing = true } = options;

  if (limitMs <= 0) {
    // No throttling if limit is zero or negative
    const noThrottle = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
      return func.apply(this, args);
    } as ThrottledFunction<F>;
    noThrottle.cancel = () => {};
    noThrottle.flush = () => func.apply(lastThis, lastArgs || ([] as unknown as Parameters<F>));
    noThrottle.pending = () => false;
    return noThrottle;
  }

  const invokeFunc = (
    time: number,
    context: ThisParameterType<F> | undefined,
    args: Parameters<F>
  ): ReturnType<F> => {
    lastCallTime = time;
    result = func.apply(context, args);
    if (result === undefined) {
      throw new Error('No result available to return.');
    }
    return result;
  };

  const trailingEdge = (time: number) => {
    timeoutId = undefined;
    if (trailing && lastArgs) {
      return invokeFunc(time, lastThis, lastArgs);
    }
    lastArgs = undefined; // Clear lastArgs if not invoking
    lastThis = undefined;
    if (result === undefined) {
      throw new Error('No result available to return.');
    }
    return result; // Return previous result if no trailing call
  };

  const throttled = function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ): ReturnType<F> | undefined {
    const now = Date.now();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;
    lastArgs = args;

    if (!lastCallTime && !leading) {
      // First call, but leading is false
      lastCallTime = now; // Set call time to effectively delay first execution
    }

    const remaining = limitMs - (now - lastCallTime);

    if (remaining <= 0 || remaining > limitMs) {
      // Time has passed or system clock changed
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      lastCallTime = now;
      result = invokeFunc(now, lastThis, lastArgs);
    } else if (!timeoutId && trailing) {
      // Not yet time, but schedule a trailing call if one isn't already
      timeoutId = setTimeout(() => trailingEdge(Date.now()), remaining);
    }
    return result; // Return the latest result (could be from a leading call or a previous trailing call)
  } as ThrottledFunction<F>;

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = undefined;
    lastArgs = undefined;
    lastThis = undefined;
    lastCallTime = 0; // Reset call time to allow immediate next leading call if configured
  };

  throttled.flush = (): ReturnType<F> | undefined => {
    if (timeoutId) {
      // If a trailing call is scheduled
      clearTimeout(timeoutId);
      return trailingEdge(Date.now());
    }
    // If no trailing call is pending, return the last known result.
    // Or, if the intent is to always execute if there are args, you might invoke func here.
    // For simplicity, this flush primarily executes pending trailing calls.
    if (trailing && lastArgs) {
      // Execute if there are stored args for a potential trailing call
      return invokeFunc(Date.now(), lastThis, lastArgs);
    }
    return result;
  };

  throttled.pending = (): boolean => {
    return timeoutId !== undefined;
  };

  return throttled;
}

/**
 * Returns a Promise that resolves after a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to wait. Must be non-negative.
 * @returns {Promise<void>}
 * @throws {Error} if ms is negative.
 */
export function delay(ms: number): Promise<void> {
  if (ms < 0) {
    return Promise.reject(new Error('Delay time must be non-negative.'));
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries an async function a certain number of times with an optional delay between retries.
 * @template T - The type of the result of the async function.
 * @param {() => Promise<T>} fn - The async function to retry.
 * @param {number} retries - The maximum number of retries (e.g., 3 means 1 initial attempt + 3 retries).
 * @param {number} [delayMs=0] - The delay in milliseconds between retries.
 * @param {(error: any, attempt: number) => void | Promise<void>} [onRetry] - Optional callback called before each retry.
 * @returns {Promise<T>} A promise that resolves with the result of the function or rejects after all retries fail.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number,
  delayMs: number = 0,
  onRetry?: (error: any, attempt: number) => void | Promise<void>
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        if (onRetry) {
          await Promise.resolve(onRetry(error, attempt + 1));
        }
        if (delayMs > 0) {
          await delay(delayMs);
        }
      }
    }
  }
  throw lastError;
}

/**
 * Creates a Promise that rejects if the given promise doesn't resolve or reject within a specified time.
 * @template T - The type of the result of the input promise.
 * @param {Promise<T>} promise - The promise to apply the timeout to.
 * @param {number} ms - The timeout duration in milliseconds. Must be non-negative.
 * @param {string | Error} [timeoutErrorOrMessage='Promise timed out'] - Custom error or message for timeout.
 * @returns {Promise<T>}
 */
export function promiseTimeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutErrorOrMessage: string | Error = 'Promise timed out'
): Promise<T> {
  if (ms < 0) {
    return Promise.reject(new Error('Timeout duration must be non-negative.'));
  }

  let timeoutId: TimerId | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      const error =
        timeoutErrorOrMessage instanceof Error
          ? timeoutErrorOrMessage
          : new Error(timeoutErrorOrMessage);
      reject(error);
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  });
}

/**
 * Converts a Node.js-style callback function (err-first) into a function that returns a Promise.
 * @template TResult - The expected type of the successful result from the callback.
 * @param {((...argsWithCallback: any[]) => void)} fn - The callback-style function.
 * The last argument of this function must be the callback `(err, result) => void`.
 * @returns {(...args: any[]) => Promise<TResult>} A function that returns a Promise.
 */
export function promisify<TResult>(
  fn: (...argsWithCallback: any[]) => void
): (...args: any[]) => Promise<TResult> {
  return function (this: any, ...args: any[]): Promise<TResult> {
    return new Promise((resolve, reject) => {
      const callback = (err: any, result?: TResult) => {
        if (err) {
          return reject(err);
        }
        resolve(result as TResult); // Cast needed as result can be undefined depending on callback signature
      };
      fn.apply(this, [...args, callback]);
    });
  };
}

/**
 * Runs an array of promise-returning functions in series.
 * Each function will only start after the previous one has resolved.
 * If any function rejects, the series stops and the returned promise rejects with that error.
 * @template T - The type of the result of each async task.
 * @param {Array<() => Promise<T>>} tasks - An array of functions that return promises.
 * @returns {Promise<T[]>} A promise that resolves with an array of results from all tasks.
 */
export async function asyncSeries<T = any>(tasks: Array<() => Promise<T>>): Promise<T[]> {
  const results: T[] = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

/**
 * Runs an array of promise-returning functions in parallel, with an optional concurrency limit.
 * @template T - The type of the result of each async task.
 * @param {Array<() => Promise<T>>} tasks - An array of functions that return promises.
 * @param {number} [concurrencyLimit=Infinity] - The maximum number of tasks to run concurrently.
 * @returns {Promise<T[]>} A promise that resolves with an array of results from all tasks (order maintained).
 */
export async function asyncParallel<T = any>(
  tasks: Array<() => Promise<T>>,
  concurrencyLimit: number = Infinity
): Promise<T[]> {
  if (!tasks || tasks.length === 0) {
    return Promise.resolve([]);
  }

  const results: T[] = new Array(tasks.length);
  let taskIndex = 0;
  let completedCount = 0;
  const activeWorkers: Promise<void>[] = [];

  return new Promise<T[]>((resolve, reject) => {
    const runTask = (index: number) => {
      tasks[index]()
        .then((result) => {
          results[index] = result;
          completedCount++;
          if (completedCount === tasks.length) {
            resolve(results);
          } else {
            // Remove this worker from active list and start next task if any
            const workerIndex = activeWorkers.indexOf(workerPromise);
            if (workerIndex > -1) activeWorkers.splice(workerIndex, 1);
            if (taskIndex < tasks.length) {
              startNext();
            }
          }
        })
        .catch(reject); // If any task rejects, the whole promiseParallel rejects
    };

    let workerPromise: Promise<void>; // To hold the current worker promise for removal

    const startNext = () => {
      if (taskIndex < tasks.length) {
        const currentIndex = taskIndex++;
        workerPromise = Promise.resolve().then(() => runTask(currentIndex)); // Wrap in Promise.resolve to ensure it's a promise
        activeWorkers.push(workerPromise);
      }
    };

    const limit = Math.max(1, Math.min(tasks.length, concurrencyLimit));
    for (let i = 0; i < limit; i++) {
      startNext();
    }
  });
}

/**
 * Polls an async function until a condition is met or it times out.
 * @template T - The type of the result from the polling function.
 * @param {() => Promise<T>} fnToPoll - The async function to call repeatedly.
 * @param {(result: T) => boolean} condition - A function that takes the result of `fnToPoll` and returns true if polling should stop.
 * @param {number} intervalMs - The interval in milliseconds between polling attempts. Must be non-negative.
 * @param {number} [timeoutMs] - Optional timeout in milliseconds for the entire polling operation.
 * @returns {Promise<T>} A promise that resolves with the result satisfying the condition, or rejects on timeout or error.
 */
export function poll<T>(
  fnToPoll: () => Promise<T>,
  condition: (result: T) => boolean,
  intervalMs: number,
  timeoutMs?: number
): Promise<T> {
  if (intervalMs < 0) {
    return Promise.reject(new Error('Polling interval must be non-negative.'));
  }
  if (timeoutMs !== undefined && timeoutMs < 0) {
    return Promise.reject(new Error('Polling timeout must be non-negative.'));
  }

  return new Promise<T>((resolve, reject) => {
    let overallTimeoutId: TimerId | undefined;
    let intervalId: TimerId | undefined;

    const clearTimeouts = () => {
      if (overallTimeoutId) clearTimeout(overallTimeoutId);
      if (intervalId) clearInterval(intervalId as any); // clearInterval takes number, but Node returns object
    };

    const attempt = async () => {
      try {
        const result = await fnToPoll();
        if (condition(result)) {
          clearTimeouts();
          resolve(result);
        }
        // If condition not met, interval will trigger next attempt (or timeout will fire)
      } catch (error) {
        clearTimeouts();
        reject(error);
      }
    };

    if (timeoutMs !== undefined) {
      overallTimeoutId = setTimeout(() => {
        clearTimeouts();
        reject(new Error(`Polling timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    }

    // Initial attempt
    attempt();
    // Subsequent attempts via interval
    intervalId = setInterval(attempt, intervalMs);
    // Ensure the very first attempt (if fast) doesn't cause interval to run too soon after resolving/rejecting.
    // The clearTimeouts in attempt() handles this.
  });
}

/**
 * ==========================================================================
 * State Management Utilities
 * ==========================================================================
 */

/**
 * A generic action with a type and an optional payload.
 */
export interface Action<T extends string = string, P = any> {
  type: T;
  payload?: P;
}

/**
 * Any action type, useful for reducers that handle various actions.
 */
export type AnyAction = Action<string, any>;

/**
 * A reducer function that takes the current state and an action, and returns the new state.
 * @template S - The type of the state.
 * @template A - The type of the action.
 */
export type Reducer<S, A extends Action = AnyAction> = (state: S, action: A) => S;

/**
 * A function to unsubscribe a listener.
 */
export type Unsubscribe = () => void;

/**
 * A listener function that is called with the new state.
 * @template T - The type of the state.
 */
export type Listener<T> = (value: T) => void;

/**
 * Represents the structure returned by createState.
 */
export type StateHook<T> = [
  () => T, // getState
  (updater: T | ((prevState: T) => T)) => void, // setState
  (listener: Listener<T>) => Unsubscribe // subscribe
];

/**
 * Represents the structure returned by createReducer.
 */
export type ReducerHook<S, A extends Action = AnyAction> = [
  () => S, // getState
  (action: A) => void, // dispatch
  (listener: Listener<S>) => Unsubscribe // subscribe
];

/**
 * Creates a simple state holder with a getter, setter, and subscriber.
 * (Similar to React's useState or a basic observable store)
 *
 * @template T - The type of the state.
 * @param {T} initialValue - The initial value of the state.
 * @returns {StateHook<T>} A tuple containing [getState, setState, subscribe].
 */
export function createState<T>(initialValue: T): StateHook<T> {
  let value: T = initialValue;
  const listeners = new Set<Listener<T>>();

  const getState = (): T => value;

  const setState = (updater: T | ((prevState: T) => T)): void => {
    const oldValue = value;
    if (typeof updater === 'function') {
      // TypeScript needs assertion here if T could be a function type itself.
      // Assuming updater is (prevState: T) => T
      value = (updater as (prevState: T) => T)(oldValue);
    } else {
      value = updater;
    }

    // Notify listeners only if the value has actually changed.
    // Object.is handles NaN, +0/-0 correctly.
    if (!Object.is(oldValue, value)) {
      // Create a new Set from listeners for iteration to avoid issues
      // if a listener unsubscribes itself during notification.
      new Set(listeners).forEach((listener) => listener(value));
    }
  };

  const subscribe = (listener: Listener<T>): Unsubscribe => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return [getState, setState, subscribe];
}

// Overloads for createReducer to handle optional initializer
/**
 * Creates a state holder managed by a reducer function, without an initializer.
 * (Similar to React's useReducer)
 *
 * @template S - The type of the state.
 * @template A - The type of the action, defaults to AnyAction.
 * @param {Reducer<S, A>} reducer - A function that determines how the state changes.
 * @param {S} initialState - The initial state.
 * @returns {ReducerHook<S, A>} A tuple containing [getState, dispatch, subscribe].
 */
export function createReducer<S, A extends Action = AnyAction>(
  reducer: Reducer<S, A>,
  initialState: S
): ReducerHook<S, A>;

/**
 * Creates a state holder managed by a reducer function, with an initializer.
 * (Similar to React's useReducer with an init function)
 *
 * @template S - The type of the state.
 * @template A - The type of the action, defaults to AnyAction.
 * @template I - The type of the initial argument passed to the initializer.
 * @param {Reducer<S, A>} reducer - A function that determines how the state changes.
 * @param {I} initialArg - The argument to pass to the initializer function.
 * @param {(initialArg: I) => S} initializer - Function to compute the initial state lazily.
 * @returns {ReducerHook<S, A>} A tuple containing [getState, dispatch, subscribe].
 */
export function createReducer<S, A extends Action = AnyAction, I = any>(
  reducer: Reducer<S, A>,
  initialArg: I | S, // Can be S if initializer is not provided
  initializer?: (initialArg: I) => S
): ReducerHook<S, A> {
  let value: S = initializer ? initializer(initialArg as I) : (initialArg as S);
  const listeners = new Set<Listener<S>>();

  const getState = (): S => value;

  const dispatch = (action: A): void => {
    const oldValue = value;
    value = reducer(oldValue, action);

    if (!Object.is(oldValue, value)) {
      new Set(listeners).forEach((listener) => listener(value));
    }
  };

  const subscribe = (listener: Listener<S>): Unsubscribe => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return [getState, dispatch, subscribe];
}

/**
 * A map of reducer functions, where keys correspond to state slices.
 * @template S - The overall state type.
 * @template A - The action type.
 */
export type ReducersMapObject<S, A extends Action = AnyAction> = {
  [K in keyof S]: Reducer<S[K], A>;
};

/**
 * Combines an object of reducer functions into a single reducer function.
 * It will call every child reducer, and gather their results into a single state object,
 * whose keys correspond to the keys of the passed reducers.
 *
 * @template S - The type of the combined state object.
 * @template A - The type of the action, defaults to AnyAction.
 * @param {ReducersMapObject<S, A>} reducers - An object whose values are different reducer functions.
 * @returns {Reducer<S, A>} A reducer function that invokes every reducer inside the passed object,
 * and builds a state object with the same shape.
 */
export function combineReducers<S extends Record<string, any>, A extends Action = AnyAction>(
  reducers: ReducersMapObject<S, A>
): Reducer<S, A> {
  const reducerKeys = Object.keys(reducers) as Array<keyof S>;

  return function combination(state: S | undefined, action: A): S {
    const nextState: S = {} as S;
    let hasChanged = false;

    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducers[key];
      const previousStateForKey = state ? state[key] : undefined;
      const nextStateForKey = reducer(previousStateForKey as S[keyof S], action); // Type assertion for S[keyof S]

      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || !Object.is(nextStateForKey, previousStateForKey);
    }
    // If the state argument was undefined, or any child reducer changed its slice, return new object.
    // Otherwise, if state was provided and no child reducer changed, return original state reference.
    return state === undefined || hasChanged ? nextState : state;
  };
}

/**
 * A simple equality check function.
 */
type EqualityFn<T = any> = (a: T, b: T) => boolean;

const defaultEqualityFn: EqualityFn = (a, b) => Object.is(a, b);

/**
 * Input selectors for createSelector.
 */
type InputSelector<S, R> = (state: S) => R;
type InputSelectors<S, Props = any> = Array<InputSelector<S, any> | InputSelector<S & Props, any>>;

// Basic createSelector (can be expanded for more input selectors or props)
/**
 * Creates a memoized selector.
 * The result function is memoized, meaning it only recalculates if its input values (derived from input selectors) change.
 * This version supports up to 5 input selectors for type safety.
 *
 * @template S - State type
 * @template R - Result type of the selector
 * @template P1 - Result type of the first input selector
 */
export function createSelector<S, R, P1>(
  selector1: InputSelector<S, P1>,
  combiner: (param1: P1) => R,
  equalityFn?: EqualityFn<R>
): (state: S) => R;
export function createSelector<S, R, P1, P2>(
  selector1: InputSelector<S, P1>,
  selector2: InputSelector<S, P2>,
  combiner: (param1: P1, param2: P2) => R,
  equalityFn?: EqualityFn<R>
): (state: S) => R;
export function createSelector<S, R, P1, P2, P3>(
  selector1: InputSelector<S, P1>,
  selector2: InputSelector<S, P2>,
  selector3: InputSelector<S, P3>,
  combiner: (param1: P1, param2: P2, param3: P3) => R,
  equalityFn?: EqualityFn<R>
): (state: S) => R;
// Add more overloads if needed for more parameters or use a more generic signature with rest parameters (less type-safe for combiner).

export function createSelector(...args: any[]): (state: any) => any {
  let lastResult: any;
  let lastArgs: any[] | undefined;
  const equality =
    (args.find(
      (arg) =>
        typeof arg === 'function' &&
        arg.length === 2 &&
        (args.indexOf(arg) === args.length - 1 ||
          (args.indexOf(arg) === args.length - 2 && typeof args[args.length - 1] !== 'function'))
    ) as EqualityFn | undefined) || defaultEqualityFn;
  const combiner = args.pop() as (...res: any[]) => any; // Last function is the combiner
  const inputSelectors = args as InputSelector<any, any>[];

  if (typeof combiner !== 'function') {
    throw new Error('createSelector expects the last argument to be a function (combiner).');
  }
  if (inputSelectors.some((selector) => typeof selector !== 'function')) {
    throw new Error('createSelector expects input selectors to be functions.');
  }

  return function memoizedSelector(state: any): any {
    const newArgs = inputSelectors.map((selector) => selector(state));

    if (
      lastArgs &&
      newArgs.length === lastArgs.length &&
      newArgs.every((newArg, index) => equality(newArg, lastArgs![index]))
    ) {
      return lastResult;
    }

    lastArgs = newArgs;
    lastResult = combiner(...newArgs);
    return lastResult;
  };
}

/**
 * Watches a piece of state derived from a store and calls a listener when it changes.
 *
 * @template T - The type of the state slice to watch.
 * @param store - A store-like object, e.g., the result of `createState` or `createReducer`.
 * Must provide `getState` and `subscribe` methods.
 * @param {(state: ReturnType<Store['getState']>) => T} selector - A function to select the state slice to watch.
 * @param {(newValue: T, oldValue: T | undefined) => void} listener - The function to call when the selected state changes.
 * @param {object} [options] - Optional configuration.
 * @param {EqualityFn<T>} [options.equalityFn=Object.is] - Function to compare old and new selected state.
 * @returns {Unsubscribe} A function to stop watching.
 */
export function watch<S, T>(
  store: { getState: () => S; subscribe: (listener: Listener<S>) => Unsubscribe },
  selector: (state: S) => T,
  listener: (newValue: T, oldValue: T | undefined) => void,
  options?: { equalityFn?: EqualityFn<T> }
): Unsubscribe {
  let previousSelectedState: T | undefined = undefined;
  let isFirstRun = true;
  const { equalityFn = defaultEqualityFn } = options || {};

  const handleChange = () => {
    const currentState = store.getState();
    const currentSelectedState = selector(currentState);

    if (isFirstRun || !equalityFn(previousSelectedState as T, currentSelectedState)) {
      listener(currentSelectedState, isFirstRun ? undefined : previousSelectedState);
      previousSelectedState = currentSelectedState;
      isFirstRun = false;
    }
  };

  // Call initially to get the first state and potentially trigger listener
  handleChange();

  const unsubscribe = store.subscribe(handleChange);
  return unsubscribe;
}

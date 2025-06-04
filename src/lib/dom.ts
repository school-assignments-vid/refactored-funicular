/**
 * ==========================================================================
 * DOM Utilities
 * ==========================================================================
 */

/**
 * Represents common DOM event targets.
 */
type EventTargetLike = Element | Window | Document;

/**
 * Represents possible children for the createEl function.
 */
type CreatableChildren = string | Node | Array<string | Node>;

/**
 * Represents attributes for the createEl function.
 * Allows string, number, or boolean values which will be converted to strings.
 */
interface ElementAttributes {
  [key: string]: string | number | boolean;
}

/**
 * Alias for `document.getElementById`.
 * @param {string} id - The ID of the element to find.
 * @param {Document} [doc=document] - The document to search within (defaults to global document).
 * @returns {HTMLElement | null} The element if found, otherwise null.
 */
export const getById = (id: string, doc: Document = document): HTMLElement | null =>
  doc.getElementById(id);

/**
 * Alias for `document.querySelector`.
 * @template T - The specific Element type expected.
 * @param {string} selector - CSS selector.
 * @param {Document | Element} [parent=document] - Parent element or document to search within.
 * @returns {T | null} The first element matching the selector, or null if not found.
 */
export const qs = <T extends Element = Element>(
  selector: string,
  parent: Document | Element = document
): T | null => parent.querySelector<T>(selector);

/**
 * Alias for `document.querySelectorAll`.
 * @template T - The specific Element type expected.
 * @param {string} selector - CSS selector.
 * @param {Document | Element} [parent=document] - Parent element or document to search within.
 * @returns {NodeListOf<T>} A static NodeList of elements matching the selector.
 */
export const qsa = <T extends Element = Element>(
  selector: string,
  parent: Document | Element = document
): NodeListOf<T> => parent.querySelectorAll<T>(selector);

/**
 * Alias for `parentElement.getElementsByClassName`.
 * @template T - The specific Element type expected (defaults to Element).
 * @param {string} classNames - A string containing one or more class names to match on, separated by whitespace.
 * @param {Document | Element} [parent=document] - Parent element or document to search within.
 * @returns {HTMLCollectionOf<T>} A live HTMLCollection of found elements.
 */
export const getByClass = <T extends Element = Element>(
  classNames: string,
  parent: Document | Element = document
): HTMLCollectionOf<T> => parent.getElementsByClassName(classNames) as HTMLCollectionOf<T>;

/**
 * Alias for `parentElement.getElementsByTagName`.
 * @template K - A key of HTMLElementTagNameMap or SVGElementTagNameMap for specific tag types.
 * @param {K} tagName - The qualified name to look for (e.g., 'div', 'a', 'svg').
 * @param {Document | Element} [parent=document] - Parent element or document to search within.
 * @returns {HTMLCollectionOf<HTMLElementTagNameMap[K]> | HTMLCollectionOf<SVGElementTagNameMap[K]> | HTMLCollectionOf<Element>} A live HTMLCollection of found elements.
 */
export const getByTag = <K extends keyof (HTMLElementTagNameMap & SVGElementTagNameMap)>(
  tagName: K,
  parent: Document | Element = document
): K extends keyof HTMLElementTagNameMap
  ? HTMLCollectionOf<HTMLElementTagNameMap[K]>
  : K extends keyof SVGElementTagNameMap
  ? HTMLCollectionOf<SVGElementTagNameMap[K]>
  : HTMLCollectionOf<Element> => parent.getElementsByTagName(tagName) as any; // `as any` is pragmatic here due to complex conditional type

/**
 * Adds an event listener to an event target.
 * @template T - The type of the EventTargetLike.
 * @template K - The key of the event map for the target.
 * @param {T} target - The element, window, or document to attach the event to.
 * @param {K} event - The event name (e.g., 'click', 'load').
 * @param {(this: T, ev: K extends keyof HTMLElementEventMap ? HTMLElementEventMap[K] : K extends keyof WindowEventMap ? WindowEventMap[K] : K extends keyof DocumentEventMap ? DocumentEventMap[K] : Event) => any} handler - The event handler function.
 * @param {boolean | AddEventListenerOptions} [options] - Optional event listener options.
 * @returns {() => void} Function to remove the event listener.
 */
export const on = <
  T extends EventTargetLike,
  K extends string // Using string for broader event name compatibility
>(
  target: T,
  event: K,
  handler: (
    this: T,
    ev: K extends keyof HTMLElementEventMap // Check specific maps first
      ? HTMLElementEventMap[K]
      : K extends keyof WindowEventMap
      ? WindowEventMap[K]
      : K extends keyof DocumentEventMap
      ? DocumentEventMap[K]
      : Event // Fallback to generic Event
  ) => any,
  options?: boolean | AddEventListenerOptions
): (() => void) => {
  target.addEventListener(event, handler as EventListener, options);
  return () => target.removeEventListener(event, handler as EventListener, options);
};

/**
 * Removes an event listener from an event target.
 * @template T - The type of the EventTargetLike.
 * @template K - The key of the event map for the target.
 * @param {T} target - The element, window, or document to remove the event from.
 * @param {K} event - The event name.
 * @param {(this: T, ev: K extends keyof HTMLElementEventMap ? HTMLElementEventMap[K] : K extends keyof WindowEventMap ? WindowEventMap[K] : K extends keyof DocumentEventMap ? DocumentEventMap[K] : Event) => any} handler - The event handler function.
 * @param {boolean | EventListenerOptions} [options] - Optional event listener options.
 */
export const off = <T extends EventTargetLike, K extends string>(
  target: T,
  event: K,
  handler: (
    this: T,
    ev: K extends keyof HTMLElementEventMap
      ? HTMLElementEventMap[K]
      : K extends keyof WindowEventMap
      ? WindowEventMap[K]
      : K extends keyof DocumentEventMap
      ? DocumentEventMap[K]
      : Event
  ) => any,
  options?: boolean | EventListenerOptions
): void => {
  target.removeEventListener(event, handler as EventListener, options);
};

/**
 * Adds a class or multiple classes (space-separated) to an element.
 * @param {Element} element - The DOM element.
 * @param {string} classNames - The class name(s) to add.
 */
export function addClass(element: Element, classNames: string): void {
  if (element?.classList && typeof classNames === 'string' && classNames.trim() !== '') {
    element.classList.add(...classNames.trim().split(/\s+/));
  }
}

/**
 * Removes a class or multiple classes (space-separated) from an element.
 * @param {Element} element - The DOM element.
 * @param {string} classNames - The class name(s) to remove.
 */
export function removeClass(element: Element, classNames: string): void {
  if (element?.classList && typeof classNames === 'string' && classNames.trim() !== '') {
    element.classList.remove(...classNames.trim().split(/\s+/));
  }
}

/**
 * Toggles a class on an element. Only one class name is recommended for predictable return value.
 * @param {Element} element - The DOM element.
 * @param {string} className - The class name to toggle.
 * @param {boolean} [force] - Optional boolean to force add (true) or remove (false) the class.
 * @returns {boolean | undefined} The value of `classList.toggle` if a single class is provided and successful, otherwise undefined.
 */
export function toggleClass(
  element: Element,
  className: string,
  force?: boolean
): boolean | undefined {
  if (element?.classList && typeof className === 'string') {
    const singleClassName = className.trim();
    if (singleClassName.includes(' ')) {
      console.warn(
        'toggleClass with multiple classes is not recommended for predictable return value. Use addClass/removeClass or iterate.'
      );
      // Fallback for multiple classes, return value becomes ambiguous
      singleClassName.split(/\s+/).forEach((cls) => cls && element.classList.toggle(cls, force));
      return undefined;
    }
    if (singleClassName) {
      return element.classList.toggle(singleClassName, force);
    }
  }
  return undefined;
}

/**
 * Checks if an element has a specific class.
 * @param {Element} element - The DOM element.
 * @param {string} className - The class name to check for (must be a single class).
 * @returns {boolean} True if the element has the class, false otherwise.
 */
export function hasClass(element: Element, className: string): boolean {
  return element?.classList && typeof className === 'string' && className.trim() !== ''
    ? element.classList.contains(className.trim())
    : false;
}

/**
 * Sets CSS styles for an element.
 * @param {HTMLElement | SVGElement} element - The DOM element.
 * @param {Partial<CSSStyleDeclaration>} styles - An object where keys are CSS property names (camelCase) and values are the property values.
 */
export function setStyle(
  element: HTMLElement | SVGElement,
  styles: Partial<CSSStyleDeclaration>
): void {
  if (element?.style && typeof styles === 'object') {
    Object.assign(element.style, styles);
  }
}

/**
 * Gets a CSS style property value from an element (from inline or computed styles).
 * @param {HTMLElement | SVGElement} element - The DOM element.
 * @param {keyof CSSStyleDeclaration} styleName - The CSS property name (camelCase or kebab-case).
 * @returns {string} The value of the CSS property, or an empty string if not found.
 */
export function getStyle(
  element: HTMLElement | SVGElement,
  styleName: keyof CSSStyleDeclaration
): string {
  if (element?.style && styleName) {
    const style = element.style as CSSStyleDeclaration; // Ensure style object is treated as CSSStyleDeclaration
    // Property names in CSSStyleDeclaration are camelCase
    if (typeof style[styleName] === 'string' && style[styleName] !== '') {
      return style[styleName] as string;
    }
    // Fallback to computed style
    const computedStyle = getComputedStyle(element);
    return computedStyle[styleName as any] || ''; // `as any` is for flexibility with potential vendor prefixes not in `keyof CSSStyleDeclaration`
  }
  return '';
}

/**
 * Creates a DOM element with specified tag, attributes, and children.
 * @template K - The tag name of the element to create.
 * @param {K} tagName - The tag name for the element (e.g., 'div', 'span', 'a').
 * @param {ElementAttributes} [attributes={}] - An object of attributes to set on the element.
 * @param {CreatableChildren} [children=[]] - Content to append to the element (text, other elements, or an array).
 * @returns {HTMLElementTagNameMap[K] | SVGElementTagNameMap[K extends keyof SVGElementTagNameMap ? K : never]} The created DOM element, typed specifically if K is a known HTML or SVG tag.
 */
export function createEl<K extends keyof (HTMLElementTagNameMap & SVGElementTagNameMap)>(
  tagName: K,
  attributes: ElementAttributes = {},
  children: CreatableChildren = []
): K extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[K]
  : K extends keyof SVGElementTagNameMap
  ? SVGElementTagNameMap[K]
  : Element {
  // Fallback for generic tags
  const el = document.createElement(tagName) as Element; // Start with Element, will be cast by return type

  for (const key in attributes) {
    if (Object.prototype.hasOwnProperty.call(attributes, key)) {
      el.setAttribute(key, String(attributes[key]));
    }
  }

  const appendChildToElement = (child: string | Node) => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  };

  if (Array.isArray(children)) {
    children.forEach(appendChildToElement);
  } else if (children) {
    // Check if children is not empty or null
    appendChildToElement(children);
  }
  return el as any; // Pragmatic `as any` due to complex conditional return type; TypeScript infers it correctly.
}

/**
 * Removes an element from the DOM.
 * @param {Element} element - The element to remove.
 */
export function removeEl(element: Element): void {
  element?.parentNode?.removeChild(element);
}

/**
 * Prepends a child element to a parent element.
 * @param {Element} parentEl - The parent element.
 * @param {Node} childEl - The child node (Element, Text, etc.) to prepend.
 */
export function prepend(parentEl: Element, childEl: Node): void {
  parentEl.insertBefore(childEl, parentEl.firstChild);
}

/**
 * Appends a child node to a parent element.
 * @param {Element} parentEl - The parent element.
 * @param {Node} childEl - The child node to append.
 */
export function append(parentEl: Element, childEl: Node): void {
  parentEl.appendChild(childEl);
}

/**
 * Inserts a new node before a reference node.
 * @param {Node} newNode - The node to insert.
 * @param {Node} referenceNode - The node before which newNode is inserted.
 */
export function insertBefore(newNode: Node, referenceNode: Node): void {
  referenceNode.parentNode?.insertBefore(newNode, referenceNode);
}

/**
 * Inserts a new node after a reference node.
 * @param {Node} newNode - The node to insert.
 * @param {Node} referenceNode - The node after which newNode is inserted.
 */
export function insertAfter(newNode: Node, referenceNode: Node): void {
  referenceNode.parentNode?.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * Gets the closest ancestor of the current element (or the current element itself) which matches the selector.
 * @template T - The specific Element type expected.
 * @param {Element} element - The starting element.
 * @param {string} selector - A string containing a selector list.
 * @returns {T | null} The closest ancestor or null if not found.
 */
export const closest = <T extends Element = Element>(
  element: Element,
  selector: string
): T | null => {
  return element.closest<T>(selector);
};

/**
 * Gets the parent node of a node.
 * @param {Node} node - The node whose parent is to be found.
 * @returns {Node | null} The parent node or null if it doesn't exist.
 */
export const parent = (node: Node): Node | null => {
  return node.parentNode;
};

/**
 * Gets the children of an element (only Element nodes).
 * @param {Element} element - The element whose children are to be retrieved.
 * @returns {HTMLCollection} A live HTMLCollection of child elements.
 */
export const children = (element: Element): HTMLCollection => {
  return element.children;
};

/**
 * Gets or sets a data attribute on an element.
 * Automatically converts camelCase keys to kebab-case for the attribute name.
 * e.g., `data(el, 'userId', 123)` sets `data-user-id="123"`.
 * e.g., `data(el, 'userId')` gets the value of `data-user-id`.
 * @param {HTMLElement} element - The element.
 * @param {string} key - The data attribute key (e.g., 'user-id' or 'userId'). Not including 'data-'.
 * @param {string | number | boolean} [value] - The value to set for the data attribute. If undefined, the function gets the attribute.
 * @returns {string | null | void} The attribute value (string or null) if getting, or void if setting.
 */
export function data(
  element: HTMLElement,
  key: string,
  value?: string | number | boolean
): string | null | void {
  // Convert camelCase key to kebab-case and ensure 'data-' prefix
  const dataKey = `data-${key
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^data-/, '')}`;

  if (typeof value !== 'undefined') {
    element.setAttribute(dataKey, String(value));
  } else {
    return element.getAttribute(dataKey);
  }
}

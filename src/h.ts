import { ComponentProps } from './types';

type Child = HTMLElement | string | number | null | undefined;

export function h(
  tag: string | ((props: any) => HTMLElement),
  props: { [key: string]: any } | null,
  ...children: Child[]
): HTMLElement {
  if (typeof tag === 'function') {
    return tag({ ...props, children });
  }

  const el = document.createElement(tag);

  if (props) {
    for (const key in props) {
      const value = props[key];

      if (key === 'ref' && typeof value === 'function') {
        value(el);
        continue;
      }

      if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.substring(2).toLowerCase();
        el.addEventListener(eventName, value);
      } else if (key === 'className') {
        el.setAttribute('class', value);
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (typeof value === 'boolean' && value) {
        el.setAttribute(key, '');
      } else if (value != null && typeof value !== 'function') {
        el.setAttribute(key, String(value));
      }
    }
  }

  const appendChild = (child: Child) => {
    if (child instanceof Node) {
      el.appendChild(child);
    } else if (child !== null && child !== undefined) {
      el.appendChild(document.createTextNode(String(child)));
    }
  };

  children.forEach((child) => {
    if (Array.isArray(child)) {
      child.forEach(appendChild);
    } else {
      appendChild(child);
    }
  });

  return el;
}

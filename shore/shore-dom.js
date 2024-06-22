import { Signal } from './shore-signal.js';
import { asArray } from './shore-utils.js';

/**
 * @param {keyof HTMLElementTagNameMap} tagName
 */
export function e(tagName, attributes = {}, props = {}, children = []) {
  const element = document.createElement(tagName);

  for (const name of Object.keys(attributes)) {
    unwrapValue(attributes[name], value => element.setAttribute(name, value));
  }

  for (const name of Object.keys(props)) {
    unwrapValue(props[name], value => (element[name] = value));
  }

  for (const child of asArray(children).flat(Infinity)) {
    element.append(child);
  }

  return element;
}

export function $if(condition, elements, elseElements = []) {
  unwrapValue(condition, visible => {
    asArray(elements).forEach(element => {
      element.style.display = visible ? null : 'none';
    });
    asArray(elseElements).forEach(element => {
      element.style.display = visible ? 'none' : null;
    });
  });

  return [...asArray(elements), ...asArray(elseElements)];
}

export function $repeat(count, element) {
  const result = [];

  for (let i = 0; i < count; i++) {
    result.push(element instanceof Function ? element(i) : element);
  }

  return result;
}

export function $each(array, element) {
  const result = [];

  for (let i = 0; i < array.length; i++) {
    result.push(element instanceof Function ? element(array[i]) : element);
  }

  return result;
}

function unwrapValue(valueOrSignal, handler) {
  if (valueOrSignal instanceof Signal) {
    valueOrSignal.effect(value => handler(value), { immediate: true });
  } else {
    handler(valueOrSignal);
  }
}

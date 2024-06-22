import { ShoreComponent } from './shore-component.js';
import { ShoreObservable } from './shore-observable.js';
import { ShoreSignal } from './shore-signal.js';
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
    if (child instanceof ShoreObservable) {
      let previousElements = [];

      child.subscribe(
        elements => {
          previousElements.forEach(previous => previous.remove());
          previousElements = elements.map(unwrapElement);
          previousElements.forEach(innerElement => element.append(innerElement));
        },
        { immediate: true },
      );
    } else {
      asArray(unwrapElement(child)).forEach(unwrapped => element.append(unwrapped));
    }
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
  const observable = new ShoreObservable();

  unwrapValue(array, elements => {
    const result = [];

    for (let i = 0; i < elements.length; i++) {
      result.push(element instanceof Function ? element(elements[i]) : element);
    }

    observable.emit(result);
  });

  return observable;
}

function unwrapValue(valueOrSignal, handler) {
  if (valueOrSignal instanceof ShoreSignal) {
    valueOrSignal.effect(value => handler(value), { immediate: true });
  } else {
    handler(valueOrSignal);
  }
}

function unwrapElement(element) {
  if (element instanceof ShoreComponent) {
    const children = element.$render();
    element.$afterViewInit();
    return children;
  }
  return element;
}

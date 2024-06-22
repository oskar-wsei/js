import { ShoreComponent } from './shore-component.js';
import { asArray } from './shore-utils.js';

export class ShoreApplication {
  #components = [];

  constructor(rootElement, context = {}) {
    this.rootElement =
      rootElement instanceof Node ? rootElement : document.querySelector(rootElement);
    this.context = context;
  }

  bootstrap = (component) => {
    this.#renderRecursive(component, this.rootElement);
    this.#invokeViewInit();
  };

  #renderRecursive = (component, element) => {
    let results = component;
    if (component instanceof ShoreComponent) {
      component.$context = this.context;
      results = component.$render();
      this.#components.push(component);
    }
    results = asArray(results);

    for (const result of results) {
      if (result instanceof ShoreComponent) {
        this.#renderRecursive(result, element);
      } else if (Array.isArray(result)) {
        result.forEach(inner => {
          this.#renderRecursive(inner, element);
        });
      } else {
        if (result !== null && result !== undefined) element.append(result);
      }
    }
  };

  #invokeViewInit() {
    this.#components.forEach(component => component.$afterViewInit());
  }
}

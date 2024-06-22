export class ShoreSignal {
  #value = undefined;
  #effects = new Set();

  constructor(initialValue) {
    this.#value = initialValue;
  }

  get() {
    return this.#value;
  }

  set(value) {
    if (value instanceof Function) value = value(this.#value);
    this.#value = value;
    this.#runEffects();
    return this;
  }

  effect(handler, { immediate } = {}) {
    this.#effects.add(handler);
    if (immediate) this.#runEffect(handler);
    return this;
  }

  derive(handler) {
    const derived = new ShoreSignal();
    this.effect(value => derived.set(handler(value)), { immediate: true });
    return derived;
  }

  select(key) {
    return this.derive(value => value[key]);
  }

  off(handler) {
    this.#effects.delete(handler);
    return this;
  }

  #runEffects() {
    for (const effect of this.#effects.values()) {
      this.#runEffect(effect);
    }
  }

  #runEffect(effect) {
    effect(this.#value, this);
  }
}

export function signal(initialValue = undefined) {
  return new ShoreSignal(initialValue);
}

export function combine(handler, ...signals) {
  const combined = new ShoreSignal();

  const valueChanged = () => {
    combined.set(handler(...signals.map(signal => signal.get())));
  };

  signals.forEach(signal => signal.effect(valueChanged, { immediate: true }));
  return combined;
}

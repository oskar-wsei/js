export class ShoreObservable {
  callbacks = [];
  lastValue = undefined;

  subscribe(callback, { immediate } = {}) {
    this.callbacks.push(callback);
    if (immediate) callback(this.lastValue);
  }

  emit(event = undefined) {
    this.callbacks.forEach(callback => callback(event));
    this.lastValue = event;
  }
}

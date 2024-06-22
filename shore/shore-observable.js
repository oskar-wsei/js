export class ShoreObservable {
  callbacks = [];

  subscribe(callback) {
    this.callbacks.push(callback);
  }

  emit(event = undefined) {
    this.callbacks.forEach(callback => callback(event));
  }
}

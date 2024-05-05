const addAsync = async (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return Promise.reject('Argumenty muszą mieć typ number!');
  }
  return new Promise(resolve => setTimeout(() => resolve(a + b), 100));
};

class AsyncQueue {
  queue = [];
  tasks = 0;
  resolve = null;

  constructor(queue) {
    this.queue = queue;
  }

  run() {
    return new Promise(resolve => {
      this.resolve = resolve;
      this.schedule();
    });
  }

  schedule() {
    while (this.queue.length > 1) this.runTaskAsync();
  }

  async runTaskAsync() {
    this.tasks++;
    this.queue.push(await addAsync(this.queue.shift(), this.queue.shift()));
    this.tasks--;
    this.check();
  }

  check() {
    this.schedule();
    if (this.tasks === 0 && this.queue.length === 1) this.resolve(this.queue[0])
  }
}

const addAllAsync = async (...numbers) => {
  if (numbers.length === 0) return 0;
  return new AsyncQueue(numbers).run();
};

const measureAsync = async callbackAsync => {
  const start = performance.now();
  await callbackAsync();
  return performance.now() - start;
};

const countAsync = async callbackAsync => {
  const promiseThen = Promise.prototype.then;
  let asyncCallCount = 0;

  Promise.prototype.then = function (onFulfilled, onRejected) {
    asyncCallCount++;
    return promiseThen.apply(this, [onFulfilled, onRejected]);
  };

  await callbackAsync();

  Promise.prototype.then = promiseThen;
  return asyncCallCount;
};

const main = async () => {
  const numbers = new Array(100).fill(10);

  const asyncCalls = await countAsync(async () => {
    const elapsed = await measureAsync(async () => {
      const sum = await addAllAsync(...numbers);
      console.log(`Sum: ${sum}`);
    });
    console.log(`Time elapsed: ${elapsed / 1000}s`);
  });
  console.log(`Async calls: ${asyncCalls}`);
};

void main();

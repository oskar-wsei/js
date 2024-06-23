import { Screen } from './screen.js';

export class Game {
  screen = new Screen();
  canvas = this.screen.canvas;
  context = this.screen.context;
  entities = [];
  fps = 0;
  paused = false;
  #lastFpsMeasure = performance.now();
  #frameCount = 0;

  start() {
    this.init();
    this.#tick();
  }

  init() {}

  update(canvas) {}

  render(context) {}

  #tick = () => {
    requestAnimationFrame(this.#tick);

    if (!this.paused) {
      this.entities.forEach(entity => entity.update(this.canvas));
      this.update(this.canvas);
    }

    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.entities.forEach(entity => entity.render(this.context));
    this.render(this.context);

    this.#frameCount++;

    if (performance.now() - this.#lastFpsMeasure >= 1000) {
      this.#lastFpsMeasure = performance.now();
      this.fps = this.#frameCount;
      this.#frameCount = 0;
    }
  };
}

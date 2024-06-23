export class Entity {
  static #nextId = 1;
  id = Entity.#nextId++;

  /** @param {HTMLCanvasElement} canvas */
  update(canvas) {}

  /** @param {CanvasRenderingContext2D} context */
  render(context) {}
}

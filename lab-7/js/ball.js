import { Entity } from './entity.js';
import { Vector2 } from './vector2.js';

export class Ball extends Entity {
  position = new Vector2();
  targetVelocity = new Vector2();
  velocity = new Vector2();
  radius = 0;
  damping = 0.05;

  /** @param {HTMLCanvasElement} canvas */
  update(canvas) {
    this.position.add(this.velocity);
    this.#handleWallCollistions(canvas);
    this.#adjustSpeed();
  }

  /** @param {CanvasRenderingContext2D} context */
  render(context) {
    context.fillStyle = '#fff';
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }

  #handleWallCollistions(canvas) {
    if (this.position.x < this.radius) {
      this.velocity.x = -this.velocity.x;
      this.position.x = this.radius;
    } else if (this.position.x > canvas.width - this.radius) {
      this.velocity.x = -this.velocity.x;
      this.position.x = canvas.width - this.radius;
    }

    if (this.position.y < this.radius) {
      this.velocity.y = -this.velocity.y;
      this.position.y = this.radius;
    } else if (this.position.y > canvas.height - this.radius) {
      this.velocity.y = -this.velocity.y;
      this.position.y = canvas.height - this.radius;
    }
  }

  #adjustSpeed() {
    const diffSquared = this.targetVelocity.lengthSquared() - this.velocity.lengthSquared();
    if (Math.abs(diffSquared) < 1) return;

    const speedRatio = Math.sqrt(
      this.targetVelocity.lengthSquared() / this.velocity.lengthSquared(),
    );
    const factor = 1 + (speedRatio - 1) * this.damping;
    this.velocity.multiplyScalar(factor);
  }
}

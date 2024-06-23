import { Ball } from './ball.js';
import { Game } from './game.js';
import { Vector2 } from './vector2.js';

export class BallsGame extends Game {
  numberOfBalls = 0;
  lineDistance = 0;

  init() {
    this.#initListeners();
    this.#populateScene();
  }

  update(canvas) {}

  render(context) {
    const visitedLineIds = new Set();
    const maxDistanceSquared = this.lineDistance ** 2;

    for (const ball of this.entities) {
      for (const otherBall of this.entities) {
        if (ball.id === otherBall.id) continue;
        const minId = Math.min(ball.id, otherBall.id);
        const maxId = Math.max(ball.id, otherBall.id);
        const lineId = `${minId}-${maxId}`;

        if (visitedLineIds.has(lineId)) continue;
        visitedLineIds.add(lineId);

        const distanceSquared = ball.position.distanceSquared(otherBall.position);

        if (distanceSquared < maxDistanceSquared) {
          context.beginPath();
          context.strokeStyle = getColorBasedOnDistance(distanceSquared, maxDistanceSquared);
          context.lineWidth = 2;
          context.moveTo(ball.position.x, ball.position.y);
          context.lineTo(otherBall.position.x, otherBall.position.y);
          context.stroke();
        }
      }
    }

    document.querySelector('#ui-fps').textContent = `${Math.floor(this.fps)} fps`;
  }

  #populateScene() {
    this.entities.length = 0;

    for (let i = 0; i < this.numberOfBalls; i++) {
      this.#createRandomBall();
    }
  }

  #createRandomBall() {
    const ball = new Ball();
    ball.position.set(Math.random() * canvas.width, Math.random() * canvas.height);
    ball.velocity.set(Math.random() * 4 - 2, Math.random() * 4 - 2);
    ball.targetVelocity.copy(ball.velocity);
    ball.radius = Math.random() * 10 + 1;
    this.entities.push(ball);
  }

  #adjustBallCount() {
    if (this.entities.length > this.numberOfBalls) {
      this.entities.length = this.numberOfBalls;
      return;
    }

    for (let i = 0; i < this.numberOfBalls - this.entities.length; i++) {
      this.#createRandomBall();
    }
  }

  #initListeners() {
    const uiStartStop = document.querySelector('#ui-start-stop');
    const uiNumBalls = document.querySelector('#ui-num-balls');
    const uiDistance = document.querySelector('#ui-distance');
    this.numberOfBalls = uiNumBalls.value;
    this.lineDistance = uiDistance.value;

    uiStartStop.addEventListener('click', () => (this.paused = !this.paused));

    uiNumBalls.addEventListener('input', event => {
      event.stopPropagation();
      event.preventDefault();
      this.numberOfBalls = uiNumBalls.value;
      this.#adjustBallCount();
    });

    uiDistance.addEventListener('input', event => {
      event.stopPropagation();
      event.preventDefault();
      this.lineDistance = uiDistance.value;
    });

    this.canvas.addEventListener('mousemove', event => {
      this.#repellBalls(event.clientX, event.clientY);
    });

    this.canvas.addEventListener('click', event => {
      const entity = this.#findEntityAt(event.clientX, event.clientY);
      if (!entity) return;
      this.entities = this.entities.filter(other => other.id !== entity.id);
      this.numberOfBalls++;
      this.#adjustBallCount();
    });
  }

  #repellBalls(x, y) {
    const position = new Vector2(x, y);
    const radius = this.canvas.width * 0.15;
    const radiusSquared = radius ** 2;

    for (const ball of this.entities) {
      const distanceSquared = ball.position.distanceSquared(position);
      if (distanceSquared < radiusSquared) {
        ball.velocity.set((ball.position.x - x) * 0.05, (ball.position.y - y) * 0.05);
      }
    }
  }

  #findEntityAt(x, y) {
    const position = new Vector2(x, y);

    for (const entity of this.entities) {
      if (position.distanceSquared(entity.position) < entity.radius ** 2) {
        return entity;
      }
    }

    return null;
  }
}

new BallsGame().start();

function getColorBasedOnDistance(distance, maxDistance) {
  if (distance > maxDistance) return null;
  const ratio = Math.min(Math.max(distance / maxDistance, 0), 1);
  const colorValue = Math.floor(255 * (1 - ratio));
  const alpha = colorValue.toString(16).padStart(2, '0');
  return `#ffffff${alpha}`;
}

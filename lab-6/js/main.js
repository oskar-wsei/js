import { Ball } from './ball.js';
import { Game } from './game.js';

export class BallsGame extends Game {
  numberOfBalls = 0;
  lineDistance = 0;
  ball = null;

  orientation = {
    x: 0,
    y: 0,
  };

  init() {
    const ball = new Ball();
    ball.position.set(Math.random() * canvas.width, Math.random() * canvas.height);
    ball.radius = 100;
    this.entities.push(ball);

    window.addEventListener('deviceorientation', event => {
      this.orientation.x = event.beta * 0.5;
      this.orientation.y = event.gamma;
    });

    this.ball = ball;
  }

  update(canvas) {
    this.ball.velocity.x += this.orientation.y * 0.01;
    this.ball.velocity.y += this.orientation.x * 0.01;
  }

  render(context) {}
}

new BallsGame().start();

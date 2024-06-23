export class Screen {
  canvas = document.querySelector('#canvas');
  context = this.canvas.getContext('2d');

  constructor() {
    this.fitCanvasToSceen();
    addEventListener('resize', this.fitCanvasToSceen);
  }

  fitCanvasToSceen() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}

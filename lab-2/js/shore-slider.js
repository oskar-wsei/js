export class ShoreSlider {
  /** @type {HTMLElement} */ element;
  /** @type {HTMLElement} */ wrapper;
  /** @type {HTMLElement[]} */ slides;

  #currentSlide = 0;

  constructor(options) {
    this.options = options;
    this.element = document.querySelector(options.element);
    this.slides = [...this.element.children];
    this.#initializeElements();
    this.update();
  }

  update() {
    const sliderWidth = this.element.getBoundingClientRect().width;
    const { slidesPerPage } = this.options;

    this.slides.forEach(slide => {
      slide.style.width = `${sliderWidth / slidesPerPage}px`;
    });
  }

  previous() {
    this.navigate(this.#currentSlide - 1);
  }

  next() {
    this.navigate(this.#currentSlide + 1);
  }

  navigate(index) {
    const slideIndex = index % this.slides.length;
    this.#currentSlide = slideIndex;

    let translateX = 0;

    for (let i = 0; i < slideIndex; i++) {
      translateX -= this.slides[i].getBoundingClientRect().width;
    }

    const style = window.getComputedStyle(this.wrapper);
    const matrix = new DOMMatrix(style.transform);

    const animation = new ShoreAnimation({
      duration: this.options.duration,
      from: matrix.m41,
      to: translateX,
      timingFunction: time => time,
    });

    animation.subscribe(current => {
      this.wrapper.style.transform = `translateX(${current}px)`;
    });

    animation.start();
  }

  #initializeElements() {
    this.element.classList.add('shore-slider');

    this.slides.forEach(slide => {
      slide.classList.add('shore-slide');
    });

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('shore-wrapper');

    while (this.element.hasChildNodes()) {
      this.wrapper.appendChild(this.element.firstChild);
    }

    this.element.appendChild(this.wrapper);

    this.#initializeArrows();
    this.#initializeTabs();
  }

  #initializeArrows() {
    this.arrows = document.createElement('div');
    this.arrows.className = 'shore-nav shore-arrows';
    this.element.appendChild(this.arrows);

    this.arrowPrevious = document.createElement('button');
    this.arrowPrevious.textContent = '<';
    this.arrowPrevious.className = 'shore-arrow shore-previous';
    this.arrowPrevious.addEventListener('click', () => this.previous());
    this.arrows.appendChild(this.arrowPrevious);

    this.arrowNext = document.createElement('button');
    this.arrowNext.textContent = '>';
    this.arrowNext.className = 'shore-arrow shore-next';
    this.arrowNext.addEventListener('click', () => this.next());
    this.arrows.appendChild(this.arrowNext);
  }

  #initializeTabs() {
    this.tabs = document.createElement('div');
    this.tabs.className = 'shore-nav shore-tabs';
    this.element.appendChild(this.tabs);

    this.slides.forEach((_slide, index) => {
      const tab = document.createElement('button');
      tab.textContent = index + 1;
      tab.className = 'shore-tab';
      tab.addEventListener('click', () => this.navigate(index));
      this.tabs.appendChild(tab);
    });
  }
}

class Observable {
  constructor() {
    this.callbacks = [];
  }

  subscribe(callback) {
    this.callbacks.push(callback);
  }

  emit(event) {
    this.callbacks.forEach(callback => callback(event));
  }
}

class ShoreAnimation extends Observable {
  #startTime = -1;

  constructor(options) {
    super();
    this.options = options;
  }

  start() {
    this.#startTime = performance.now();
    requestAnimationFrame(this.#tick);
  }

  #tick = () => {
    const now = performance.now();
    const elapsed = Math.min(now - this.#startTime, this.options.duration);
    const progress = this.options.timingFunction(elapsed / this.options.duration);
    const value = (this.options.to - this.options.from) * progress + this.options.from;
    this.emit(value);

    if (elapsed < this.options.duration) {
      requestAnimationFrame(this.#tick);
    }
  };
}

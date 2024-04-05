export class ShoreSlider {
  /** @type {HTMLElement} */ element;
  /** @type {HTMLElement} */ wrapper;
  /** @type {HTMLElement[]} */ slides;

  #currentSlide = undefined;

  constructor(element, options) {
    this.options = options;
    this.element = element instanceof HTMLElement ? element : document.querySelector(element);
    this.slides = [...this.element.children];
    this.isPlaying = false;
    this.playingInterval = 0;
    this.#initializeElements();
    this.update();
    this.navigate(0);
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
    const previousSlideIndex = this.#currentSlide;
    const curretSlideIndex = (index > 0 ? index : this.slides.length + index) % this.slides.length;
    this.#currentSlide = curretSlideIndex;

    const animations = {
      slide: AnimationTypeSlide,
      fade: AnimationTypeFade,
    };

    const animation = new animations[this.options.type](this);
    animation.run(curretSlideIndex, previousSlideIndex);
  }

  toggle() {
    this.isPlaying ? this.stop() : this.start();
  }

  start() {
    if (this.isPlaying) this.stop();
    this.isPlaying = true;
    this.playingInterval = setInterval(() => this.next(), this.options.delay);
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    clearInterval(this.playingInterval);
  }

  #initializeElements() {
    this.element.classList.add('shore-slider');

    this.slides.forEach(slide => {
      slide.classList.add('shore-slide');
    });

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('shore-wrapper');
    this.wrapper.classList.add(`shore-animation-${this.options.type}`);

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

export class AnimationType {
  constructor(slider) {
    this.slider = slider;
  }

  run(_currentIndex, _previousIndex) {}
}

export class AnimationTypeSlide extends AnimationType {
  run(currentIndex, _previousIndex) {
    let translateX = 0;

    for (let i = 0; i < currentIndex; i++) {
      translateX -= this.slider.slides[i].getBoundingClientRect().width;
    }

    const style = window.getComputedStyle(this.slider.wrapper);
    const matrix = new DOMMatrix(style.transform);

    const animation = new ShoreAnimation({
      duration: this.slider.options.duration,
      from: matrix.m41,
      to: translateX,
      timingFunction: this.slider.options.timingFunction,
    });

    animation.subscribe(current => {
      this.slider.wrapper.style.transform = `translateX(${current}px)`;
    });

    animation.start();
  }
}

export class AnimationTypeFade extends AnimationType {
  run(currentIndex, previousIndex) {
    if (previousIndex === undefined) {
      this.slider.slides[currentIndex].style.opacity = 1;
      return;
    }

    const animation = new ShoreAnimation({
      duration: this.slider.options.duration,
      from: 0,
      to: 1,
      timingFunction: this.slider.options.timingFunction,
    });

    this.slider.slides[previousIndex].style.zIndex = 0;
    this.slider.slides[currentIndex].style.opacity = 0;
    this.slider.slides[currentIndex].style.zIndex = 1;

    animation.subscribe(current => {
      this.slider.slides[currentIndex].style.opacity = current;

      if (current >= 1) this.slider.slides[previousIndex].style.opacity = 0;
    });

    animation.start();
  }
}

/** https://easings.net/ */
export const TimingFunction = {
  EaseOutCubic: x => 1 - Math.pow(1 - x, 3),
  EaseInCubic: x => Math.pow(x, 3),
  EaseOutBounce: easeOutBounce,
  EaseInBounce: x => 1 - easeOutBounce(1 - x),
  EaseOutElastic: easeOutElastic,
  EaseInElastic: x => 1 - easeOutElastic(1 - x),
  EaseOutCirc: x => Math.sqrt(1 - Math.pow(x - 1, 2)),
  EaseInCirc: x => 1 - Math.sqrt(1 - Math.pow(x, 2)),
};

function easeOutBounce(x) {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

function easeOutElastic(x) {
  const c4 = (2 * Math.PI) / 3;

  return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

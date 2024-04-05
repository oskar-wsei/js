import { ShoreLightbox } from './shore-lightbox.js';
import { ShoreSlider, TimingFunction } from './shore-slider.js';

const slider = new ShoreSlider('#slider', {
  slidesPerPage: 1,
  duration: 500,
  delay: 1000,
  type: 'slide',
  timingFunction: TimingFunction.EaseOutCubic,
});

document.querySelectorAll('[data-lightbox]').forEach(element => {
  let resumeSlider = false;

  new ShoreLightbox(element, {
    onShow() {
      resumeSlider = slider.isPlaying;
      slider.stop();
    },
    onHide() {
      if (resumeSlider) slider.start();
    }
  });
});

document.querySelector('#btn-play-pause').addEventListener('click', () => {
  slider.toggle();
});

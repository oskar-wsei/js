export class ShoreLightbox {
  /** @type {HTMLElement} */ element;
  /** @type {HTMLElement | null} */ #overlay = null;

  /** @param {HTMLElement} element */
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.#initializeListeners();
  }

  show = () => {
    const overlay = document.createElement('div');
    overlay.className = 'shore-lightbox-overlay';
    document.body.append(overlay);
    this.#overlay = overlay;

    const btnClose = document.createElement('button');
    btnClose.className = 'shore-lightbox-btn-close';
    btnClose.innerHTML = '&times;';
    btnClose.addEventListener('click', this.hide);
    overlay.append(btnClose);

    const media = this.element.cloneNode(true);
    media.className = 'shore-lightbox-media';
    media.style = null;
    overlay.append(media);

    media.play?.();
    this.options?.onShow?.();
  };

  hide = () => {
    this.#overlay.remove();
    this.options?.onHide?.();
  };

  #initializeListeners() {
    this.element.addEventListener('click', event => {
      event.preventDefault();
      this.show();
    });
  }
}

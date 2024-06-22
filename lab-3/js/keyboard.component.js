import { $each, e, ShoreComponent } from '../../shore/index.js';

export class KeyboardComponent extends ShoreComponent {
  keysDown = new Set();
  keysRefs = new Map();

  $render() {
    const sounds = this.$context.soundController.sounds;

    return e('div', { class: 'keyboard' }, {}, [
      $each(sounds, sound => {
        const ref = e(
          'button',
          { type: 'button', class: 'keyboard-key' },
          { onclick: () => this.playSound(sound.key) },
          sound.key.toUpperCase(),
        );
        this.keysRefs.set(sound.key, ref);
        return ref;
      }),
    ]);
  }

  $afterViewInit() {
    addEventListener('keydown', event => {
      if (this.keysDown.has(event.key)) return;
      this.keysDown.add(event.key);
      this.playSound(event.key);
    });

    addEventListener('keyup', event => {
      this.keysDown.delete(event.key);
    });

    this.$context.soundController.subscribe(event => {
      const keyRef = this.keysRefs.get(event.key);
      keyRef.classList.toggle('active', event.state === 'play');
    });
  }

  playSound(key) {
    this.$context.soundController.playSound(key);
  }
}

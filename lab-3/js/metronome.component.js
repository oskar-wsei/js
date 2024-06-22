import { e, ShoreComponent, signal } from '../../shore/index.js';

export class MetronomeComponent extends ShoreComponent {
  active = signal(false);
  tempo = signal(60); // bps
  tempoText = this.tempo.derive(tempo => `${tempo} bps`);

  tickTask = 0;

  constructor(props) {
    super(props);
    this.active.effect(this.handleActiveStateChange, { immediate: true });
  }

  $render() {
    return e('div', { class: 'metronome' }, {}, [
      e('label', {}, {}, [
        e('input', { type: 'checkbox' }, { checked: this.active, onchange: this.toggle }),
        'Metronome',
      ]),
      e('div', {}, {}, [
        e(
          'input',
          {
            type: 'range',
            value: this.tempo,
            min: 30,
            max: 240,
          },
          {
            oninput: this.changeTempo,
          },
        ),
        e('div', {}, { textContent: this.tempoText }),
      ]),
    ]);
  }

  toggle = () => {
    this.active.set(active => !active);
  };

  changeTempo = event => {
    this.tempo.set(event.currentTarget.value);
  };

  handleActiveStateChange = active => {
    if (active) this.playMetronomeTick();
    else clearTimeout(this.tickTask);
  };

  playMetronomeTick = () => {
    this.$context.soundController.playMetronome();
    this.tickTask = setTimeout(this.playMetronomeTick, 60 * 1000 / this.tempo.get());
  }
}

import { $repeat, e, ShoreComponent, ShoreObservable } from '../../shore/index.js';
import { KeyboardComponent } from './keyboard.component.js';
import { MetronomeComponent } from './metronome.component.js';
import { TrackComponent } from './track.component.js';

export class AppComponent extends ShoreComponent {
  onPlayAll = new ShoreObservable();

  $render() {
    return [
      new KeyboardComponent(),
      new MetronomeComponent(),
      $repeat(4, () => new TrackComponent({ onPlay: this.onPlayAll })),
      e('div', {}, {}, e('button', {}, { onclick: () => this.onPlayAll.emit() }, 'Play all')),
    ];
  }
}

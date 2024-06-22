import { ShoreComponent, signal } from '../../shore/index.js';
import { HeaderComponent } from './header.component.js';
import { NotesComponent } from './notes.component.js';

export class AppComponent extends ShoreComponent {
  searchPhrase = signal('');

  $render() {
    return [
      new HeaderComponent({ searchPhrase: this.searchPhrase }),
      new NotesComponent({ searchPhrase: this.searchPhrase }),
    ];
  }
}

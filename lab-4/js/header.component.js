import { e, ShoreComponent } from '../../shore/index.js';

export class HeaderComponent extends ShoreComponent {
  $render() {
    return e('header', { class: 'app-header' }, {}, [
      e('h1', { class: 'app-title' }, {}, 'Notekeep'),
      e('div', { class: 'app-search-bar' }, {}, [
        e(
          'input',
          { type: 'text', class: 'app-search-field', placeholder: 'Search notes...' },
          { oninput: event => this.$props.searchPhrase.set(event.currentTarget.value) },
        ),
      ]),
    ]);
  }
}

import { e, ShoreComponent } from '../../shore/index.js';

export class NoteEditorComponent extends ShoreComponent {
  title = this.$props.note.select('title');
  description = this.$props.note.select('description');

  $render() {
    return [
      e('div', { class: 'note-editor' }, {}, [
        e('div', {}, {}, [
          e(
            'input',
            { type: 'text' },
            { value: this.title, oninput: event => this.title.set(event.currentTarget.value) },
          ),
        ]),
        e('div', {}, {}, [
          e(
            'textarea',
            {},
            {
              value: this.description,
              oninput: event => this.description.set(event.currentTarget.value),
            },
          ),
        ]),
        e('button', {}, { onclick: this.close }, 'Cancel'),
        e('button', {}, { onclick: this.save }, 'Save'),
      ]),
    ];
  }

  save = () => {
    this.$props.note.set(note => ({
      ...note,
      title: this.title.get(),
      description: this.description.get(),
    }));
    this.close();
  };

  close = () => {
    this.title.set(this.$props.note.get().title);
    this.description.set(this.$props.note.get().description);
    this.$props.onClose();
  };
}

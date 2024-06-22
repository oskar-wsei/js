import { $if, combine, e, ShoreComponent, signal } from '../../shore/index.js';
import { NoteEditorComponent } from './note-editor.component.js';

const pinIcon = `
<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
  <path
    d="M32 32C32 14.3 46.3 0 64 0H320c17.7 0 32 14.3 32 32s-14.3 32-32 32H290.5l11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3H32c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64H64C46.3 64 32 49.7 32 32zM160 384h64v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V384z"
  />
</svg>`;

const calendarIcon = `
<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
  <path
    d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"
  />
</svg>`;

export class NoteComponent extends ShoreComponent {
  title = this.$props.note.select('title');
  createdAt = this.$props.note.select('createdAt');
  description = this.$props.note.select('description');
  bgColor = this.$props.note.select('bgColor');
  style = combine(bgColor => `background-color: ${bgColor}`, this.bgColor);
  isEditing = signal(false);

  $render() {
    return e('div', { class: 'note', style: this.style }, {}, [
      e('div', { class: 'note-header' }, {}, [
        e('h3', { class: 'note-title' }, { textContent: this.title }),
        e(
          'button',
          { class: 'note-pin', title: 'Pin/Unpin' },
          { innerHTML: pinIcon, onclick: this.togglePin },
        ),
      ]),
      e('div', { class: 'note-creation-date', title: 'Created at' }, {}, [
        e('span', {}, { innerHTML: calendarIcon }),
        e('span', {}, { textContent: this.createdAt }),
      ]),
      e('div', { class: 'note-description' }, { textContent: this.description }),
      e('input', { type: 'color', value: this.bgColor }, { oninput: this.handleColorChange }),
      e('button', {}, { onclick: this.editNote }, 'Edit'),
      e('button', {}, { onclick: () => this.$props.remove() }, 'Remove'),

      $if(
        this.isEditing,
        e(
          'div',
          {},
          {},
          [
            new NoteEditorComponent({
              note: this.$props.note,
              onClose: this.closeEditor,
            }),
          ],
          true,
        ),
      ),
    ]);
  }

  handleColorChange = event => {
    this.$props.note.set(note => ({ ...note, bgColor: event.currentTarget.value }));
    this.$props.saveNotes();
  };

  editNote = () => {
    this.isEditing.set(true);
  };

  togglePin = () => {
    this.$props.note.set(note => ({ ...note, pinned: !note.pinned }));
    this.$props.refreshNotes();
  };

  closeEditor = () => {
    this.isEditing.set(false);
    this.$props.saveNotes();
  };
}

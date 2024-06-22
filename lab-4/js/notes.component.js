import { $each, $if, combine, e, ShoreComponent, signal } from '../../shore/index.js';
import { NoteComponent } from './note.component.js';

export class NotesComponent extends ShoreComponent {
  notes = signal([]);
  filteredNotes = combine(
    (notes, searchPhrase) => this.filterNotes(notes, searchPhrase),
    this.notes,
    this.$props.searchPhrase,
  );
  pinnedNotes = this.filteredNotes.derive(notes => notes.filter(note => note.get().pinned));
  showPinnedNotes = this.pinnedNotes.derive(notes => notes.length);

  constructor(props) {
    super(props);
    this.notes.effect(this.saveNotes);
  }

  $render() {
    const renderNote = note =>
      new NoteComponent({
        note,
        refreshNotes: this.refreshNotes,
        saveNotes: this.saveNotes,
        remove: () => this.notes.set(notes => notes.filter(other => other !== note)),
      });

    return [
      e('div', { class: 'note-board' }, {}, [
        $if(
          this.showPinnedNotes,
          e('div', { class: 'note-section' }, {}, [
            e('h2', { class: 'note-section-title' }, {}, 'Pinned notes'),
            e('div', { class: 'note-container' }, {}, $each(this.pinnedNotes, renderNote)),
          ]),
        ),

        e('div', { class: 'note-section' }, {}, [
          e('h2', { class: 'note-section-title' }, {}, 'My notes'),
          e('div', { class: 'note-container' }, {}, $each(this.filteredNotes, renderNote)),
        ]),
      ]),
      e('div', {}, {}, [e('button', {}, { onclick: this.createNote }, 'Create note')]),
    ];
  }

  $afterViewInit() {
    const notes = this.$context.store.load();
    notes.reverse();
    notes.forEach(this.addNote);
  }

  createNote = () => {
    this.addNote({
      title: 'Note title',
      createdAt: new Date().toLocaleString('pl-PL'),
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, aliquam.',
      pinned: false,
      bgColor: '#ffffff',
    });
  };

  addNote = note => {
    this.notes.set(notes => [signal(note), ...notes]);
  };

  refreshNotes = () => {
    this.notes.set(notes => notes);
  };

  filterNotes(notes, searchPhrase) {
    return notes.filter(note => {
      const { title, description, createdAt } = note.get();
      return [title, description, createdAt].some(text => text.includes(searchPhrase));
    });
  }

  saveNotes = () => {
    const notes = this.notes.get().map(note => note.get());
    this.$context.store.save(notes);
  };
}

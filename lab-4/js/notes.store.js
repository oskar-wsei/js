const storageKey = 'app-notes';

export class NotesStore {
  load() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? '[]') ?? [];
    } catch {
      return [];
    }
  }

  save(notes) {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }
}

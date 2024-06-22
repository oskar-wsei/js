import { ShoreApplication } from '../../shore/index.js';
import { AppComponent } from './app.component.js';
import { NotesStore } from './notes.store.js';

const context = {
  store: new NotesStore(),
}

const app = new ShoreApplication('#app-root', context);
app.bootstrap(new AppComponent());

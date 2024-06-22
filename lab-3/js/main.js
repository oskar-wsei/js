import { ShoreApplication } from '../../shore/index.js';
import { AppComponent } from './app.component.js';
import { SoundController } from './sounds.js';

const context = {
  soundController: new SoundController(),
};

const app = new ShoreApplication('#app-root', context);
app.bootstrap(new AppComponent());

const soundsBasePath = 'sounds';

const keyboardRef = document.querySelector('#keyboard');

/** @type {HTMLInputElement} */
const ctrlSustainRef = document.querySelector('#ctrl-sustain');

/** @type {HTMLInputElement} */
const ctrlMetronomeTempoRef = document.querySelector('#ctrl-metronome-tempo');

/** @type {Map<string, string>} */
const sounds = new Map();
sounds.set('a', 'clap.wav');
sounds.set('s', 'kick.wav');
sounds.set('d', 'hihat.wav');
sounds.set('f', 'boom.wav');
sounds.set('g', 'openhat.wav');
sounds.set('h', 'ride.wav');
sounds.set('j', 'snare.wav');
sounds.set('k', 'tink.wav');
sounds.set('l', 'tom.wav');

const keysDown = new Set();

/** @type {Map<string, HTMLAudioElement>} */
const audios = new Map();

sounds.forEach((fileName, key) => {
  const audio = new Audio(`${soundsBasePath}/${fileName}`);
  audio.load();
  audios.set(key, audio);

  const keyRef = document.createElement('button');
  keyRef.className = 'keyboard-key';
  keyRef.textContent = key.toUpperCase();
  keyRef.addEventListener('click', () => playSound(key));
  keyboardRef.append(keyRef);

  audio.addEventListener('play', () => {
    keyRef.classList.add('active');
  });

  audio.addEventListener('pause', () => {
    keyRef.classList.remove('active');
  });
});

window.addEventListener('keydown', event => {
  if (keysDown.has(event.key)) return;
  keysDown.add(event.key);
  playSound(event.key);
});

window.addEventListener('keyup', event => {
  keysDown.delete(event.key);
  if (!ctrlSustainRef.checked) stopSound(event.key);
});

function playSound(key) {
  if (!sounds.has(key)) return;
  keysDown.add(key);
  const audio = audios.get(key);
  audio.pause();
  audio.currentTime = 0;
  audio.play();
}

function stopSound(key) {
  if (!sounds.has(key)) return;
  const audio = audios.get(key);
  audio.pause();
}

const metronomeAudio = new Audio(`${soundsBasePath}/metronome.mp3`);
metronomeAudio.load();

function metronomeTick() {
  metronomeAudio.currentTime = 0;
  metronomeAudio.play();
  setTimeout(metronomeTick, 1000 / parseFloat(ctrlMetronomeTempoRef.value));
}

let hasInteractedWithMetronome = false;

ctrlMetronomeTempoRef.addEventListener('click', () => {
  if (hasInteractedWithMetronome) return;
  hasInteractedWithMetronome = true;
  metronomeTick();
})

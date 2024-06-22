import { ShoreObservable } from '../../shore/index.js';

export class Sound {
  constructor(key, fileName) {
    this.key = key;
    this.fileName = fileName;
    this.audio = new Audio(`sounds/${fileName}`);
    this.audio.load();
  }
}

export class SoundController extends ShoreObservable {
  #soundMap = new Map();

  sounds = [
    new Sound('a', 'clap.wav'),
    new Sound('s', 'kick.wav'),
    new Sound('d', 'hihat.wav'),
    new Sound('f', 'boom.wav'),
    new Sound('g', 'openhat.wav'),
    new Sound('h', 'ride.wav'),
    new Sound('j', 'snare.wav'),
    new Sound('k', 'tink.wav'),
    new Sound('l', 'tom.wav'),
  ];

  metronomeSound = new Sound(null, 'metronome.mp3');

  constructor() {
    super();
    this.#initSoundMap();
  }

  playSound(key) {
    if (!this.#soundMap.has(key)) return;
    const sound = this.#soundMap.get(key);
    this.#playAudio(sound.audio);
  }

  playMetronome() {
    this.#playAudio(this.metronomeSound.audio);
  }

  #initSoundMap() {
    this.sounds.forEach(sound => {
      this.#soundMap.set(sound.key, sound);
      sound.audio.addEventListener('play', () => this.emit({ key: sound.key, state: 'play' }));
      sound.audio.addEventListener('pause', () => this.emit({ key: sound.key, state: 'pause' }));
    });
  }

  #playAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }
}

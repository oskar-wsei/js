import { $if, combine, e, ShoreComponent, signal } from '../../shore/index.js';

export class TrackComponent extends ShoreComponent {
  recording = signal(false);
  btnRecordLabel = this.recording.derive(recording =>
    recording ? 'Stop recording' : 'Start recording',
  );
  recorded = signal([]);
  recordedCount = this.recorded.derive(recorded => `Recorded ${recorded.length} beats`);
  btnPlayEnabled = combine(
    (recording, recorded) => !recording && recorded.length,
    this.recording,
    this.recorded,
  );

  recordingStartedAt = 0;

  $render() {
    return e('div', { class: 'track' }, {}, [
      e('button', {}, { textContent: this.btnRecordLabel, onclick: this.toggleRecording }),
      e('span', {}, { textContent: this.recordedCount }),
      $if(this.btnPlayEnabled, e('button', {}, { onclick: this.playRecording }, 'Play')),
    ]);
  }

  $afterViewInit() {
    this.$context.soundController.subscribe(event => {
      if (event.state !== 'play' || !this.recording.get()) return;
      this.recorded.set(recorded => [
        ...recorded,
        {
          time: performance.now() - this.recordingStartedAt,
          key: event.key,
        },
      ]);
    });

    this.$props.onPlay.subscribe(() => this.playRecording());
  }

  toggleRecording = () => {
    const shouldStart = this.recording.set(recording => !recording).get();
    if (shouldStart) this.startRecording();
  };

  startRecording = () => {
    this.recorded.set([]);
    this.recordingStartedAt = performance.now();
  };

  playRecording = () => {
    if (this.recording.get()) return;

    for (const entry of this.recorded.get()) {
      setTimeout(() => this.$context.soundController.playSound(entry.key), entry.time);
    }
  };
}

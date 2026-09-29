/**
 * Procedural Web Audio Manager for Infinite Elevator
 * Generates all elevator mechanical sounds, chimes, button clicks,
 * randomized distorted elevator muzak (looping tracks),
 * and ambient audio for all random floor scenes.
 */

interface MuzakTrack {
  id: string;
  name: string;
  genre: string;
  stepMs: number;
  chords: number[][];
  melody: (number | null)[];
  bass: number[];
}

export class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private elevatorHumGain: GainNode | null = null;
  private floorAmbienceGain: GainNode | null = null;

  // --- Elevator Muzak Processing Chain (Slightly Distorted / Lo-Fi Speaker) ---
  private muzakPreGain: GainNode | null = null;
  private muzakDistortion: WaveShaperNode | null = null;
  private muzakHighpass: BiquadFilterNode | null = null;
  private muzakLowpass: BiquadFilterNode | null = null;
  private muzakMasterGain: GainNode | null = null;
  private isPlayingMuzak: boolean = false;
  private currentMuzakTimer: number | null = null;
  private currentTrackIndex: number = -1;
  private currentTrackName: string = 'Vintage Elevator Reel';
  private muzakStep: number = 0;

  // Floor Scene Audio
  private currentFloorMusicInterval: number | null = null;

  // Elevator hum oscillators
  private humOsc1: OscillatorNode | null = null;
  private humOsc2: OscillatorNode | null = null;

  // 5 Distinct Procedural Muzak Compositions
  private muzakTracks: MuzakTrack[] = [
    {
      id: 'melted_bossa',
      name: 'Melted Bossa #9',
      genre: 'Warped Bossa Nova',
      stepMs: 260,
      chords: [
        [293.66, 349.23, 440.0, 523.25, 659.25], // Dm9
        [196.0, 293.66, 329.63, 440.0, 523.25],  // G13
        [261.63, 329.63, 392.0, 493.88, 587.33], // Cmaj9
        [220.0, 277.18, 349.23, 440.0, 554.37],  // A7b13
        [174.61, 261.63, 329.63, 392.0, 440.0],  // Fmaj7
        [164.81, 246.94, 293.66, 329.63, 392.0], // Em7
        [220.0, 277.18, 329.63, 392.0, 440.0],   // A7
        [293.66, 349.23, 440.0, 523.25],         // Dm7
      ],
      melody: [
        659.25, null, 587.33, 523.25, null, 440.0, 493.88, 523.25,
        null, 587.33, null, 523.25, 440.0, null, 392.0, 440.0,
      ],
      bass: [146.83, 220.0, 98.0, 196.0, 130.81, 196.0, 110.0, 220.0],
    },
    {
      id: 'mall_cha_cha',
      name: '1978 Department Store Cha-Cha',
      genre: 'Dusty Latin Lounge',
      stepMs: 230,
      chords: [
        [174.61, 261.63, 329.63, 349.23, 440.0], // Fmaj7
        [196.0, 293.66, 349.23, 392.0, 466.16],  // Gm7
        [130.81, 196.0, 261.63, 329.63, 466.16], // C7
        [174.61, 220.0, 261.63, 329.63, 349.23], // Fmaj7
        [233.08, 293.66, 349.23, 440.0],         // Bbmaj7
        [130.81, 196.0, 261.63, 329.63, 392.0],  // C9
        [146.83, 220.0, 261.63, 349.23],         // Dm7
        [130.81, 196.0, 246.94, 329.63, 466.16], // C7b9
      ],
      melody: [
        523.25, 587.33, null, 659.25, null, 698.46, 659.25, null,
        587.33, null, 523.25, 466.16, 440.0, null, 392.0, 349.23,
      ],
      bass: [87.31, 130.81, 98.0, 146.83, 65.41, 130.81, 87.31, 174.61],
    },
    {
      id: 'penthouse_suite',
      name: 'Penthouse Suite (Warped Tape)',
      genre: 'Melancholy Slow Jazz',
      stepMs: 340,
      chords: [
        [233.08, 293.66, 349.23, 440.0, 523.25], // Bbmaj9
        [146.83, 220.0, 261.63, 349.23, 440.0],  // Dm7
        [155.56, 233.08, 293.66, 349.23, 440.0], // Ebmaj9
        [174.61, 261.63, 349.23, 440.0, 523.25], // F9
        [196.0, 293.66, 349.23, 440.0, 523.25],  // Gm9
        [130.81, 196.0, 246.94, 311.13, 392.0],  // Cm7
        [174.61, 261.63, 349.23, 392.0, 523.25], // Fsus4
        [174.61, 261.63, 329.63, 440.0],         // F7
      ],
      melody: [
        466.16, null, 523.25, null, 587.33, null, 698.46, 587.33,
        523.25, null, 466.16, 392.0, null, 440.0, null, 349.23,
      ],
      bass: [116.54, 174.61, 73.42, 146.83, 77.78, 155.56, 87.31, 174.61],
    },
    {
      id: 'lofi_promenade',
      name: 'Breezy Atrium Promenade',
      genre: 'Sunny Supermarket Muzak',
      stepMs: 250,
      chords: [
        [261.63, 329.63, 392.0, 493.88],         // Cmaj7
        [146.83, 220.0, 261.63, 349.23, 440.0],  // Dm7
        [164.81, 246.94, 329.63, 392.0, 493.88], // Em7
        [146.83, 220.0, 261.63, 349.23],         // Dm7
        [174.61, 261.63, 329.63, 392.0, 440.0],  // Fmaj7
        [196.0, 246.94, 293.66, 349.23, 392.0],  // G7
        [261.63, 329.63, 392.0, 523.25],         // C6
        [220.0, 261.63, 329.63, 392.0],          // Am7
      ],
      melody: [
        523.25, 493.88, 523.25, null, 587.33, null, 659.25, null,
        698.46, 659.25, 587.33, 523.25, 493.88, null, 440.0, 392.0,
      ],
      bass: [130.81, 196.0, 146.83, 220.0, 164.81, 246.94, 196.0, 130.81],
    },
    {
      id: 'liminal_waiting_room',
      name: 'Dentist Waiting Room 1984',
      genre: 'Hypnotic Lo-Fi Easy Listening',
      stepMs: 310,
      chords: [
        [207.65, 261.63, 311.13, 392.0, 466.16], // Abmaj9
        [138.59, 207.65, 261.63, 311.13, 392.0], // Dbmaj9
        [174.61, 261.63, 311.13, 349.23, 415.30], // Fm9
        [155.56, 233.08, 293.66, 349.23, 415.30], // Eb9
      ],
      melody: [
        415.30, null, 466.16, 523.25, null, 622.25, 523.25, null,
        466.16, null, 415.30, 349.23, null, 392.0, 311.13, null,
      ],
      bass: [103.83, 155.56, 69.30, 138.59, 87.31, 174.61, 77.78, 155.56],
    },
  ];

  constructor() {
    // Initialized on first user click
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Floor Ambience Node
      this.floorAmbienceGain = this.ctx.createGain();
      this.floorAmbienceGain.gain.setValueAtTime(0.32, this.ctx.currentTime);
      this.floorAmbienceGain.connect(this.masterGain);

      // Elevator Engine / Hum Node
      this.elevatorHumGain = this.ctx.createGain();
      this.elevatorHumGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.elevatorHumGain.connect(this.masterGain);

      // --- Build the Lo-Fi Distorted Muzak Speaker Chain ---
      // Pre-gain: drives the saturator
      this.muzakPreGain = this.ctx.createGain();
      this.muzakPreGain.gain.setValueAtTime(0.65, this.ctx.currentTime);

      // WaveShaper: soft-clipping tape & vintage speaker distortion
      this.muzakDistortion = this.ctx.createWaveShaper();
      this.muzakDistortion.curve = this.createDistortionCurve(22) as unknown as Float32Array<ArrayBuffer>;
      this.muzakDistortion.oversample = '2x';

      // Highpass: cuts sub-bass like a small 4" elevator ceiling speaker
      this.muzakHighpass = this.ctx.createBiquadFilter();
      this.muzakHighpass.type = 'highpass';
      this.muzakHighpass.frequency.setValueAtTime(175, this.ctx.currentTime);

      // Lowpass: band limits highs with vintage resonant ceiling grille acoustic box
      this.muzakLowpass = this.ctx.createBiquadFilter();
      this.muzakLowpass.type = 'lowpass';
      this.muzakLowpass.frequency.setValueAtTime(3100, this.ctx.currentTime);
      this.muzakLowpass.Q.setValueAtTime(2.0, this.ctx.currentTime);

      // Muzak Master Fader: controls smooth fading between floors
      this.muzakMasterGain = this.ctx.createGain();
      this.muzakMasterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      // Wire: PreGain -> Distortion -> Highpass -> Lowpass -> Fader -> Master
      this.muzakPreGain.connect(this.muzakDistortion);
      this.muzakDistortion.connect(this.muzakHighpass);
      this.muzakHighpass.connect(this.muzakLowpass);
      this.muzakLowpass.connect(this.muzakMasterGain);
      this.muzakMasterGain.connect(this.masterGain);

      this.startElevatorHum();
    } catch (e) {
      console.warn('AudioContext failed to initialize', e);
    }
  }

  /**
   * Generates a warm soft-saturation distortion curve
   * modeling vintage analog cassette tape and speaker cone overdrive.
   */
  private createDistortionCurve(amount = 22): Float32Array {
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      // Soft saturation curve with subtle asymmetric warmth
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getCurrentMuzakTrackName(): string {
    return this.currentTrackName;
  }

  // --- Elevator Ambience & Hum ---
  public startElevatorHum() {
    if (!this.ctx || !this.elevatorHumGain || this.humOsc1) return;
    try {
      const t = this.ctx.currentTime;
      this.humOsc1 = this.ctx.createOscillator();
      this.humOsc1.type = 'triangle';
      this.humOsc1.frequency.setValueAtTime(65, t); // Low rumble

      this.humOsc2 = this.ctx.createOscillator();
      this.humOsc2.type = 'sine';
      this.humOsc2.frequency.setValueAtTime(110, t);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, t);

      this.humOsc1.connect(filter);
      this.humOsc2.connect(filter);
      filter.connect(this.elevatorHumGain);

      this.humOsc1.start();
      this.humOsc2.start();
    } catch {
      // Ignore
    }
  }

  public setElevatorMoving(moving: boolean) {
    if (!this.ctx || !this.elevatorHumGain) return;
    const t = this.ctx.currentTime;
    if (moving) {
      this.elevatorHumGain.gain.setTargetAtTime(0.18, t, 0.5);
      if (this.humOsc1 && this.humOsc2) {
        this.humOsc1.frequency.setTargetAtTime(75, t, 1.0);
        this.humOsc2.frequency.setTargetAtTime(130, t, 1.0);
      }
      // Start randomized distorted muzak with fade-in!
      this.startMuzak();
    } else {
      this.elevatorHumGain.gain.setTargetAtTime(0.04, t, 0.5);
      if (this.humOsc1 && this.humOsc2) {
        this.humOsc1.frequency.setTargetAtTime(55, t, 1.0);
        this.humOsc2.frequency.setTargetAtTime(95, t, 1.0);
      }
      // Fade out muzak as doors open!
      this.stopMuzak(1.4);
    }
  }

  // --- Randomized, Lo-Fi Distorted Elevator Muzak System ---
  public startMuzak() {
    if (!this.ctx || !this.muzakMasterGain || !this.muzakPreGain) return;

    // Pick a randomized track different from previous
    let nextIdx = Math.floor(Math.random() * this.muzakTracks.length);
    if (nextIdx === this.currentTrackIndex && this.muzakTracks.length > 1) {
      nextIdx = (nextIdx + 1) % this.muzakTracks.length;
    }
    this.currentTrackIndex = nextIdx;
    const track = this.muzakTracks[this.currentTrackIndex];
    this.currentTrackName = track.name;
    this.muzakStep = 0;
    this.isPlayingMuzak = true;

    // Smooth Fade-In curve over 1.4s
    const t = this.ctx.currentTime;
    this.muzakMasterGain.gain.cancelScheduledValues(t);
    this.muzakMasterGain.gain.setValueAtTime(0.0001, t);
    this.muzakMasterGain.gain.linearRampToValueAtTime(0.24, t + 1.4);

    // Cancel any previous loop
    if (this.currentMuzakTimer) {
      window.clearTimeout(this.currentMuzakTimer);
      this.currentMuzakTimer = null;
    }

    // Begin looping playback
    const playStep = () => {
      if (!this.isPlayingMuzak || !this.ctx || !this.muzakPreGain) return;
      const now = this.ctx.currentTime;
      const currentChord = track.chords[Math.floor(this.muzakStep / 2) % track.chords.length];
      const currentMelodyNote = track.melody[this.muzakStep % track.melody.length];
      const currentBassNote = track.bass[this.muzakStep % track.bass.length];

      // Subtle vintage wow & flutter (tape speed instability): +/- 10 cents
      const tapeWobbleCents = Math.sin(now * 2.8) * 12 + (Math.random() - 0.5) * 6;

      // 1. Play Chord Pad / Electric Piano Voicing on on-beats
      if (this.muzakStep % 2 === 0) {
        currentChord.forEach((freq, idx) => {
          if (!this.ctx || !this.muzakPreGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          // Warm electric piano / organ timbre (triangle + square hint)
          osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, now);
          osc.detune.setValueAtTime(tapeWobbleCents + (idx - 2) * 2, now);

          const noteStart = now + idx * 0.025;
          gain.gain.setValueAtTime(0.001, noteStart);
          gain.gain.linearRampToValueAtTime(0.045, noteStart + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.95);

          osc.connect(gain);
          gain.connect(this.muzakPreGain);

          osc.start(noteStart);
          osc.stop(noteStart + 1.0);
        });
      }

      // 2. Play Melodic Voice (Vibraphone / Muted Flute)
      if (currentMelodyNote) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.type = 'triangle';
        leadOsc.frequency.setValueAtTime(currentMelodyNote, now);
        leadOsc.detune.setValueAtTime(tapeWobbleCents * 1.5, now);

        leadGain.gain.setValueAtTime(0.001, now);
        leadGain.gain.linearRampToValueAtTime(0.07, now + 0.04);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        leadOsc.connect(leadGain);
        leadGain.connect(this.muzakPreGain);

        leadOsc.start(now);
        leadOsc.stop(now + 0.48);
      }

      // 3. Play Walking / Syncopated Bass Note
      if (currentBassNote) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(currentBassNote, now);
        bassOsc.detune.setValueAtTime(tapeWobbleCents, now);

        // Lowpass to give warm upright bass thud
        const bassFilter = this.ctx.createBiquadFilter();
        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(380, now);

        bassGain.gain.setValueAtTime(0.001, now);
        bassGain.gain.linearRampToValueAtTime(0.12, now + 0.02);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.muzakPreGain);

        bassOsc.start(now);
        bassOsc.stop(now + 0.6);
      }

      // 4. Subtle Brushed Hi-Hat / Tape Tick
      if (this.muzakStep % 2 === 1) {
        const tickBuf = this.ctx.createBuffer(1, 512, this.ctx.sampleRate);
        const data = tickBuf.getChannelData(0);
        for (let i = 0; i < 512; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 80);
        }
        const tickSource = this.ctx.createBufferSource();
        tickSource.buffer = tickBuf;
        const tickGain = this.ctx.createGain();
        tickGain.gain.setValueAtTime(0.015, now);

        tickSource.connect(tickGain);
        tickGain.connect(this.muzakPreGain);
        tickSource.start(now);
      }

      this.muzakStep++;
      this.currentMuzakTimer = window.setTimeout(playStep, track.stepMs);
    };

    playStep();
  }

  /**
   * Fades out the elevator muzak smoothly over `fadeDuration` seconds
   * so the scene's unique audio takes over cleanly when doors open.
   */
  public stopMuzak(fadeDuration = 1.4) {
    if (!this.ctx || !this.muzakMasterGain || !this.isPlayingMuzak) return;
    const t = this.ctx.currentTime;

    // Smooth exponential fade-out
    this.muzakMasterGain.gain.cancelScheduledValues(t);
    this.muzakMasterGain.gain.setValueAtTime(this.muzakMasterGain.gain.value, t);
    this.muzakMasterGain.gain.linearRampToValueAtTime(0.0001, t + fadeDuration);

    window.setTimeout(() => {
      this.isPlayingMuzak = false;
      if (this.currentMuzakTimer) {
        window.clearTimeout(this.currentMuzakTimer);
        this.currentMuzakTimer = null;
      }
    }, fadeDuration * 1000);
  }

  // --- Elevator Chime (Ding!) ---
  public playChime() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const t = this.ctx.currentTime;
      const freqs = [784, 659]; // G5, E5
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const noteTime = t + idx * 0.18;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        const overtone = this.ctx.createOscillator();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(freq * 2.76, noteTime);
        const overtoneGain = this.ctx.createGain();
        overtoneGain.gain.setValueAtTime(0.15, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.4, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.6);

        osc.connect(gain);
        overtone.connect(overtoneGain);
        overtoneGain.connect(gain);
        gain.connect(this.masterGain);

        osc.start(noteTime);
        overtone.start(noteTime);
        osc.stop(noteTime + 1.7);
        overtone.stop(noteTime + 1.7);
      });
    } catch {
      // Ignore
    }
  }

  // --- Door Mechanical Sound ---
  public playDoorSound(opening: boolean) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const t = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(3, t);

      if (opening) {
        filter.frequency.setValueAtTime(300, t);
        filter.frequency.linearRampToValueAtTime(800, t + 1.2);
      } else {
        filter.frequency.setValueAtTime(750, t);
        filter.frequency.linearRampToValueAtTime(250, t + 1.2);
      }

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.2);
      gain.gain.linearRampToValueAtTime(0.01, t + 1.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(t);
      noise.stop(t + 1.4);

      const thudTime = opening ? t + 0.05 : t + 1.25;
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(120, thudTime);
      thudOsc.frequency.exponentialRampToValueAtTime(40, thudTime + 0.2);

      thudGain.gain.setValueAtTime(0.3, thudTime);
      thudGain.gain.exponentialRampToValueAtTime(0.001, thudTime + 0.25);

      thudOsc.connect(thudGain);
      thudGain.connect(this.masterGain);

      thudOsc.start(thudTime);
      thudOsc.stop(thudTime + 0.3);
    } catch {
      // Ignore
    }
  }

  // --- Button Click & Bell ---
  public playButtonClick() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.06);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.07);
    } catch {
      // Ignore
    }
  }

  public playAlarmBell() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const t = this.ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const ringTime = t + i * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(950 + (i % 2) * 200, ringTime);

        gain.gain.setValueAtTime(0.25, ringTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ringTime + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(ringTime);
        osc.stop(ringTime + 0.11);
      }
    } catch {
      // Ignore
    }
  }

  // --- Footsteps in Elevator ---
  public playFootstep() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 30, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.08);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.09);
    } catch {
      // Ignore
    }
  }

  // --- Dynamic Procedural Floor Audio Themes ---
  public startFloorTheme(theme: string) {
    this.stopFloorTheme();
    if (!this.ctx || !this.floorAmbienceGain) return;

    if (theme === 'cactus_mariachi') {
      const trumpetNotes = [587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 440.0];
      let step = 0;
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(trumpetNotes[step % trumpetNotes.length], t);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, t);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.floorAmbienceGain);

        osc.start(t);
        osc.stop(t + 0.3);

        step++;
      }, 320);
    } else if (theme === 'moon_poker') {
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800 + Math.random() * 800, t);

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 0.13);
      }, 900);
    } else if (theme === 'disco_trex') {
      const bassNotes = [110, 110, 146.83, 164.81];
      let step = 0;
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bassNotes[step % bassNotes.length], t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

        osc.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 0.24);

        step++;
      }, 250);
    } else if (theme === 'deep_ocean') {
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startFreq = 220 + Math.random() * 100;
        osc.frequency.setValueAtTime(startFreq, t);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, t + 0.8);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 0.8, t + 1.6);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

        osc.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 1.9);
      }, 2400);
    } else if (theme === 'backrooms') {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, t);

      gain.gain.setValueAtTime(0.08, t);
      gain.connect(this.floorAmbienceGain);
      osc.connect(gain);
      osc.start(t);

      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        if (Math.random() > 0.6) {
          const snapT = this.ctx.currentTime;
          const snapOsc = this.ctx.createOscillator();
          const snapGain = this.ctx.createGain();
          snapOsc.type = 'square';
          snapOsc.frequency.setValueAtTime(80 + Math.random() * 400, snapT);
          snapGain.gain.setValueAtTime(0.05, snapT);
          snapGain.gain.exponentialRampToValueAtTime(0.001, snapT + 0.05);
          snapOsc.connect(snapGain);
          snapGain.connect(this.floorAmbienceGain);
          snapOsc.start(snapT);
          snapOsc.stop(snapT + 0.06);
        }
      }, 800);
    } else if (theme === 'synthwave') {
      const notes = [220, 277.18, 329.63, 440, 554.37, 440, 329.63, 277.18];
      let step = 0;
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(notes[step % notes.length], t);

        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

        osc.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 0.18);
        step++;
      }, 160);
    } else if (theme === 'penguin_cafe') {
      // Fast, frantic ragtime piano arpeggio
      const ragtime = [523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25];
      let step = 0;
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(ragtime[step % ragtime.length], t);

        gain.gain.setValueAtTime(0.09, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

        osc.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 0.15);
        step++;
      }, 140);
    } else if (theme === 'cat_orchestra') {
      // Elegant baroque string waltz
      const waltz = [392.0, 493.88, 587.33, 783.99, 659.25, 587.33];
      let step = 0;
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(waltz[step % waltz.length], t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, t);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 0.38);
        step++;
      }, 260);
    } else if (theme === 'mannequin_hall') {
      // Warped music box notes + sub horror drone
      const musicBox = [880.0, 830.61, 783.99, 698.46, 659.25, 622.25];
      let step = 0;
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(musicBox[step % musicBox.length], t);

        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

        osc.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 0.95);
        step++;
      }, 700);
    } else if (theme === 'cursed_laundromat') {
      // Heavy unbalanced industrial washer clunks
      let step = 0;
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(step % 2 === 0 ? 80 : 55, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.18);

        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 0.25);
        step++;
      }, 340);
    } else if (theme === 'origami_dream') {
      // Peaceful pentatonic harp & wind chimes
      const koto = [293.66, 329.63, 392.0, 440.0, 587.33, 659.25];
      let step = 0;
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(koto[step % koto.length], t);

        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

        osc.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 1.25);
        step++;
      }, 450);
    } else if (theme === 'upside_down_jazz') {
      // Smooth cool walking bassline
      const bass = [130.81, 146.83, 164.81, 174.61, 196.0, 174.61, 146.83, 110.0];
      let step = 0;
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bass[step % bass.length], t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.32);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 0.35);
        step++;
      }, 300);
    } else if (theme === 'toaster_party') {
      // Bouncy chiptune electro with toaster bell
      const chip = [440, 523.25, 659.25, 880, 659.25, 783.99, 1046.5];
      let step = 0;
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(chip[step % chip.length], t);

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 0.14);
        step++;
      }, 130);
    } else if (theme === 'sumo_bananas') {
      // Booming taiko drums & hyoshigi wooden blocks
      let step = 0;
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = step % 4 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(step % 4 === 0 ? 65 : 480, t);
        osc.frequency.exponentialRampToValueAtTime(step % 4 === 0 ? 30 : 200, t + 0.2);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 0.28);
        step++;
      }, 280);
    } else if (theme === 'quantum_core') {
      // Rapid pulsing 16th-note cyber arpeggio
      const cyber = [110, 164.81, 220, 329.63, 440, 329.63, 220, 164.81];
      let step = 0;
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(cyber[step % cyber.length], t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200 + Math.sin(t * 4) * 800, t);

        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 0.12);
        step++;
      }, 100);
    } else if (theme === 'alien_biolab') {
      // Deep space ambient chords & bubbly spore resonance
      const chords = [329.63, 392.0, 493.88, 587.33, 783.99];
      let step = 0;
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(chords[step % chords.length], t);
        osc.frequency.exponentialRampToValueAtTime(chords[step % chords.length] * 1.05, t + 1.5);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.07, t + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);

        osc.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 2.1);
        step++;
      }, 1600);
    } else {
      this.currentFloorMusicInterval = window.setInterval(() => {
        if (!this.ctx || !this.floorAmbienceGain) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440 + Math.random() * 500, t);

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        osc.connect(gain);
        gain.connect(this.floorAmbienceGain);
        osc.start(t);
        osc.stop(t + 0.45);
      }, 1200);
    }
  }

  public stopFloorTheme() {
    if (this.currentFloorMusicInterval) {
      clearInterval(this.currentFloorMusicInterval);
      this.currentFloorMusicInterval = null;
    }
  }
}

export const soundManager = new SoundManager();

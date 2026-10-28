// Web Audio synthesizer for authentic Ethiopian Begena string plucks
// Models the fundamental string oscillation plus the iconic buzzing "Birz" (እንዚራ) overtone

class BegenaAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public playString(pitchHz: number = 82.41, buzzy: boolean = true) {
    if (this.isMuted) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Master gain for this note with soft attack to eliminate pops
      const masterGain = this.ctx.createGain();
      const peakGain = pitchHz < 60 ? 0.42 : pitchHz < 80 ? 0.38 : 0.34;
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(peakGain, now + 0.012); // Clean 12ms pluck attack
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);     // Natural string decay

      // Resonant body filter modeling wooden resonator
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const initialCutoff = Math.max(pitchHz * 8, buzzy ? 900 : 500);
      filter.frequency.setValueAtTime(initialCutoff, now);
      filter.frequency.exponentialRampToValueAtTime(Math.max(pitchHz * 2.5, 180), now + 2.2);
      filter.Q.setValueAtTime(2.8, now);

      // Primary tone: warm fundamental oscillator
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(pitchHz, now);

      // Secondary tone: 2nd harmonic (octave) for warmth
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(pitchHz * 2.0, now);
      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.20, now);
      osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      osc2.connect(osc2Gain);

      // Tertiary tone for deep bass notes (G1 49Hz, A1 55Hz, C2 65.41Hz) for clarity on laptop/mobile speakers
      const osc3 = this.ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(pitchHz * 3.0, now);
      const osc3Gain = this.ctx.createGain();
      osc3Gain.gain.setValueAtTime(pitchHz < 75 ? 0.14 : 0.06, now);
      osc3Gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
      osc3.connect(osc3Gain);

      // Inzira Buzzer modulator: generates traditional "Birz" (ብርዝ) gentle buzzing overtone
      if (buzzy) {
        const buzzOsc = this.ctx.createOscillator();
        buzzOsc.type = 'square';
        buzzOsc.frequency.setValueAtTime(pitchHz * 4.0, now);

        const buzzGain = this.ctx.createGain();
        buzzGain.gain.setValueAtTime(0.09, now);
        buzzGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        buzzOsc.connect(buzzGain);
        buzzGain.connect(filter);

        buzzOsc.start(now);
        buzzOsc.stop(now + 2.0);
      }

      // Connect nodes
      osc1.connect(filter);
      osc2Gain.connect(filter);
      osc3Gain.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      // Pluck impulse
      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + 3.3);
      osc2.stop(now + 3.3);
      osc3.stop(now + 3.3);
    } catch {
      // AudioContext fallback
    }
  }
}

export const begenaAudio = new BegenaAudioEngine();

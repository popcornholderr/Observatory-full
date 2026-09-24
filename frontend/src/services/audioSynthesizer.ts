// Web Audio API Synthesizer for Space Radio Signal Sonification
// Real-time acoustic reproduction of Pulsars, FRBs, SETI carriers, and Solar Storms

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private stopCallback: (() => void) | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSignal(pattern: 'pulsar' | 'chirp' | 'tone' | 'transit' | 'solar_rumble', baseFreq: number = 800, onEnded?: () => void) {
    this.stop();
    this.initCtx();
    if (!this.ctx) return;

    this.isPlaying = true;
    const ctx = this.ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.3, ctx.currentTime);
    masterGain.connect(ctx.destination);

    if (pattern === 'pulsar') {
      // Periodic clicks / pulses
      const interval = 0.714; // seconds (B0329+54)
      const numPulses = 7;
      for (let i = 0; i < numPulses; i++) {
        const osc = ctx.createOscillator();
        const pulseGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime + i * interval);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + i * interval + 0.06);

        pulseGain.gain.setValueAtTime(0.001, ctx.currentTime + i * interval);
        pulseGain.gain.exponentialRampToValueAtTime(0.8, ctx.currentTime + i * interval + 0.01);
        pulseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * interval + 0.08);

        osc.connect(pulseGain);
        pulseGain.connect(masterGain);

        osc.start(ctx.currentTime + i * interval);
        osc.stop(ctx.currentTime + i * interval + 0.1);
      }

      const totalTime = numPulses * interval * 1000;
      const timeout = setTimeout(() => {
        this.isPlaying = false;
        onEnded?.();
      }, totalTime);
      this.stopCallback = () => clearTimeout(timeout);
    } else if (pattern === 'chirp') {
      // Fast Radio Burst sweeping chirp
      const osc = ctx.createOscillator();
      const chirpGain = ctx.createGain();
      osc.type = 'sawtooth';
      
      const startTime = ctx.currentTime + 0.2;
      const duration = 0.6;
      
      osc.frequency.setValueAtTime(baseFreq * 2.5, startTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, startTime + duration);

      chirpGain.gain.setValueAtTime(0.01, startTime);
      chirpGain.gain.linearRampToValueAtTime(0.7, startTime + 0.05);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(chirpGain);
      chirpGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);

      const timeout = setTimeout(() => {
        this.isPlaying = false;
        onEnded?.();
      }, (duration + 0.4) * 1000);
      this.stopCallback = () => clearTimeout(timeout);
    } else if (pattern === 'tone') {
      // Narrowband SETI carrier with subtle Doppler drift
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();
      osc.type = 'sine';
      
      const duration = 3.5;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(baseFreq + 35, ctx.currentTime + duration);

      toneGain.gain.setValueAtTime(0.01, ctx.currentTime);
      toneGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.3);
      toneGain.gain.setValueAtTime(0.4, ctx.currentTime + duration - 0.4);
      toneGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(toneGain);
      toneGain.connect(masterGain);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);

      const timeout = setTimeout(() => {
        this.isPlaying = false;
        onEnded?.();
      }, duration * 1000);
      this.stopCallback = () => clearTimeout(timeout);
    } else if (pattern === 'transit') {
      // Ambient chord with transit dip
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const transitGain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc2.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime);

      const duration = 3.0;
      transitGain.gain.setValueAtTime(0.01, ctx.currentTime);
      transitGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.4);
      // Transit dip at middle
      transitGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.5);
      transitGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 2.2);
      transitGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc1.connect(transitGain);
      osc2.connect(transitGain);
      transitGain.connect(masterGain);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + duration);
      osc2.stop(ctx.currentTime + duration);

      const timeout = setTimeout(() => {
        this.isPlaying = false;
        onEnded?.();
      }, duration * 1000);
      this.stopCallback = () => clearTimeout(timeout);
    } else {
      // Solar rumble
      const osc = ctx.createOscillator();
      const rumbleGain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(baseFreq * 0.8, ctx.currentTime + 3.0);

      const duration = 3.0;
      rumbleGain.gain.setValueAtTime(0.01, ctx.currentTime);
      rumbleGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.5);
      rumbleGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(rumbleGain);
      rumbleGain.connect(masterGain);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);

      const timeout = setTimeout(() => {
        this.isPlaying = false;
        onEnded?.();
      }, duration * 1000);
      this.stopCallback = () => clearTimeout(timeout);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.stopCallback) {
      this.stopCallback();
      this.stopCallback = null;
    }
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const signalAudio = new AudioSynthesizer();

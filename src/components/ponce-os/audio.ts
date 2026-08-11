// Procedural synthwave engine — every note synthesized from math. No audio files.
// A minor progression (Am - F - C - G), bass + pad + pentatonic arpeggio.

const A = 220; // A3
const semitone = (n: number) => A * Math.pow(2, n / 12);

// chord roots relative to A3: Am(0), F(-4), C(3), G(-2)
const PROGRESSION = [
  { bass: semitone(-12), pad: [0, 3, 7] },     // Am
  { bass: semitone(-16), pad: [-4, 0, 3] },    // F
  { bass: semitone(-9), pad: [3, 7, 10] },     // C
  { bass: semitone(-14), pad: [-2, 2, 5] },    // G
];
const ARP = [0, 3, 7, 12, 7, 3]; // minor pentatonic-ish climb

export class SynthEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  private step = 0;
  playing = false;

  private ensure() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.0;
      const comp = this.ctx.createDynamicsCompressor();
      this.master.connect(comp).connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  private tone(freq: number, start: number, dur: number, type: OscillatorType, peak: number, filterHz?: number) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    let node: AudioNode = osc;
    if (filterHz) {
      const f = this.ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = filterHz;
      osc.connect(f);
      node = f;
    }
    node.connect(gain).connect(this.master);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  start() {
    this.ensure();
    if (!this.ctx || !this.master || this.playing) return;
    this.playing = true;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(0.16, this.ctx.currentTime, 0.4);
    const STEP = 0.16; // seconds per 16th @ ~94bpm
    let next = this.ctx.currentTime + 0.05;
    const loop = () => {
      if (!this.ctx) return;
      // if the tab was throttled and we fell behind, jump forward (no glitch burst)
      if (next < this.ctx.currentTime) next = this.ctx.currentTime + 0.05;
      // schedule 1.6s ahead: survives background-tab timer throttling seamlessly
      while (next < this.ctx.currentTime + 1.6) {
        const bar = Math.floor(this.step / 16) % PROGRESSION.length;
        const inBar = this.step % 16;
        const chord = PROGRESSION[bar];
        if (inBar % 8 === 0) this.tone(chord.bass, next, 1.1, "sawtooth", 0.20, 320); // bass
        if (inBar === 0) chord.pad.forEach((n) => this.tone(semitone(n), next, 2.4, "triangle", 0.05, 1400)); // pad
        if (inBar % 2 === 0) { // arpeggio
          const n = ARP[(this.step / 2) % ARP.length | 0];
          this.tone(semitone(chord.pad[0] + n + 12), next, 0.22, "square", 0.035, 2600);
        }
        if (inBar === 4 || inBar === 12) this.tone(3600, next, 0.05, "square", 0.012); // hat tick
        this.step += 1;
        next += STEP;
      }
      this.timer = window.setTimeout(loop, 250);
    };
    loop();
  }

  stop() {
    this.playing = false;
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    if (this.ctx && this.master) this.master.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.25);
  }

  toggle(): boolean {
    if (this.playing) this.stop(); else this.start();
    return this.playing;
  }
}

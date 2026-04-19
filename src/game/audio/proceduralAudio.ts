export function createAudioController() {
  let context: AudioContext | null = null;
  let oscillator: OscillatorNode | null = null;
  let gain: GainNode | null = null;
  let lfo: OscillatorNode | null = null;
  let lfoGain: GainNode | null = null;

  async function start() {
    if (!context) {
      context = new AudioContext();
    }

    if (context.state === "suspended") {
      await context.resume();
    }

    if (oscillator || !context) {
      return;
    }

    oscillator = context.createOscillator();
    oscillator.type = "sawtooth";
    oscillator.frequency.value = 90;

    gain = context.createGain();
    gain.gain.value = 0.03;

    lfo = context.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.8;

    lfoGain = context.createGain();
    lfoGain.gain.value = 14;

    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    lfo.start();
  }

  function stop() {
    oscillator?.stop();
    lfo?.stop();
    oscillator = null;
    lfo = null;
    gain = null;
    lfoGain = null;
  }

  function isRunning() {
    return Boolean(oscillator);
  }

  return { start, stop, isRunning };
}

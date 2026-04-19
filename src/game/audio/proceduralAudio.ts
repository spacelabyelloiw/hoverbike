export function createAudioController() {
  let context: AudioContext | null = null;
  let engineOscillator: OscillatorNode | null = null;
  let engineGain: GainNode | null = null;
  let boostOscillator: OscillatorNode | null = null;
  let boostGain: GainNode | null = null;
  let lfo: OscillatorNode | null = null;
  let lfoGain: GainNode | null = null;
  let filter: BiquadFilterNode | null = null;

  async function start() {
    if (!context) {
      context = new AudioContext();
    }

    if (context.state === "suspended") {
      await context.resume();
    }

    if (engineOscillator || !context) {
      return;
    }

    engineOscillator = context.createOscillator();
    engineOscillator.type = "sawtooth";
    engineOscillator.frequency.value = 82;

    engineGain = context.createGain();
    engineGain.gain.value = 0.028;

    boostOscillator = context.createOscillator();
    boostOscillator.type = "triangle";
    boostOscillator.frequency.value = 180;

    boostGain = context.createGain();
    boostGain.gain.value = 0;

    filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 620;

    lfo = context.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 1.2;

    lfoGain = context.createGain();
    lfoGain.gain.value = 12;

    lfo.connect(lfoGain);
    lfoGain.connect(engineOscillator.frequency);
    engineOscillator.connect(filter);
    boostOscillator.connect(filter);
    filter.connect(engineGain);
    engineGain.connect(context.destination);
    boostGain.connect(context.destination);
    boostOscillator.connect(boostGain);

    engineOscillator.start();
    boostOscillator.start();
    lfo.start();
  }

  function update(params: { speedRatio: number; driftRatio: number; boosting: boolean }) {
    if (!context || !engineOscillator || !engineGain || !boostOscillator || !boostGain || !filter) {
      return;
    }

    const now = context.currentTime;
    const speedRatio = Math.max(0, Math.min(params.speedRatio, 1));
    const driftRatio = Math.max(0, Math.min(params.driftRatio, 1));

    engineOscillator.frequency.setTargetAtTime(82 + speedRatio * 120, now, 0.08);
    engineGain.gain.setTargetAtTime(0.018 + speedRatio * 0.03 + driftRatio * 0.01, now, 0.08);
    filter.frequency.setTargetAtTime(580 + speedRatio * 820 + driftRatio * 180, now, 0.12);
    boostOscillator.frequency.setTargetAtTime(160 + speedRatio * 120, now, 0.08);
    boostGain.gain.setTargetAtTime(params.boosting ? 0.03 : 0, now, 0.06);
  }

  function stop() {
    engineOscillator?.stop();
    boostOscillator?.stop();
    lfo?.stop();
    engineOscillator = null;
    boostOscillator = null;
    lfo = null;
    engineGain = null;
    boostGain = null;
    lfoGain = null;
    filter = null;
  }

  function isRunning() {
    return Boolean(engineOscillator);
  }

  return { start, stop, isRunning, update };
}

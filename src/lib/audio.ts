let ctx: AudioContext | null = null;

/** Da chiamare dentro un gesto dell'utente (tap): i browser mobili bloccano l'audio altrimenti. */
export function unlockAudio(): void {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    // Audio non disponibile: si resta con la sola vibrazione.
  }
}

/** Tre bip brevi + vibrazione. */
export function alarm(withSound: boolean): void {
  if (!withSound) return;
  try {
    navigator.vibrate?.([200, 100, 200, 100, 300]);
  } catch {
    // ignorato
  }
  if (!ctx) return;
  const start = ctx.currentTime;
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, start + i * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.3, start + i * 0.3 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + i * 0.3 + 0.22);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start + i * 0.3);
    osc.stop(start + i * 0.3 + 0.25);
  }
}

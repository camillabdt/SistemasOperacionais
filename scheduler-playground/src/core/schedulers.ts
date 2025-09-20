import { Proc, Slice } from "./types";

// FIFO (First-In, First-Out)
export function computeFIFO(processes: Proc[]): Slice[] {
  const procs = [...processes].sort((a, b) => (a.AT - b.AT) || a.id.localeCompare(b.id));
  const slices: Slice[] = [];
  let t = 0; // começa em 0

  for (const p of procs) {
    if (t < p.AT) { // período ocioso antes da chegada
      slices.push({ id: "IDLE", start: t, end: p.AT });
      t = p.AT;
    }
    slices.push({ id: p.id, start: t, end: t + p.PT });
    t += p.PT;
  }
  return slices;
}

// Round Robin (RR)
export function computeRR(processes: Proc[], q: number): Slice[] {
  const procs = [...processes].sort((a, b) => (a.AT - b.AT) || a.id.localeCompare(b.id));
  const remaining = new Map<string, number>(procs.map(p => [p.id, p.PT]));
  const slices: Slice[] = [];
  let i = 0, t = 0;
  const rq: string[] = [];

  while (i < procs.length && procs[i].AT <= t) rq.push(procs[i++].id);

  while (rq.length || i < procs.length) {
    if (!rq.length) {
      const nextT = procs[i].AT;
      if (t < nextT) slices.push({ id: "IDLE", start: t, end: nextT });
      t = nextT;
      while (i < procs.length && procs[i].AT <= t) rq.push(procs[i++].id);
      continue;
    }
    const pid = rq.shift()!;
    const rem = remaining.get(pid)!;
    const run = Math.min(q, rem);
    const start = t, end = start + run;

    slices.push({ id: pid, start, end });
    t = end;

    while (i < procs.length && procs[i].AT <= t) rq.push(procs[i++].id);

    const newRem = rem - run;
    remaining.set(pid, newRem);
    if (newRem > 0) rq.push(pid);
  }
  return slices;
}

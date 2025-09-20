import { Proc, Slice } from "./types";

export function computeMetrics(slices: Slice[], procs: Proc[]) {
  const finish = new Map<string, number>();
  for (const s of slices) if (s.id !== "IDLE") finish.set(s.id, s.end);

  const rows = procs.map((p) => {
    const FT = finish.get(p.id) ?? 0;
    const TAT = FT - p.AT;
    const WT  = TAT - p.PT;
    const first = slices.find((s) => s.id === p.id)?.start ?? p.AT;
    return { id: p.id, start: first, finish: FT, WT, TAT };
  });

  const avgTAT = rows.reduce((a, r) => a + r.TAT, 0) / (rows.length || 1);
  const avgWT  = rows.reduce((a, r) => a + r.WT , 0) / (rows.length || 1);

  return { rows, avgTAT, avgWT };
}

import React from "react";
import type { Proc } from "../core";
import { nice } from "../lib/format";

export default function ProcessTable({
  procs, setProcs, rows, avgWT, avgTAT,
}: {
  procs: Proc[];
  setProcs: (p: Proc[]) => void;
  rows: Array<{ id: string; start: number; finish: number; WT: number; TAT: number }>;
  avgWT: number;
  avgTAT: number;
}) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border md:col-span-2">
      <div className="font-semibold mb-3">Processos (AT = chegada, PT = burst)</div>

      <div className="grid grid-cols-6 gap-2 text-sm font-mono">
        <div className="col-span-2 text-xs uppercase tracking-wide text-slate-500">ID</div>
        <div className="text-xs uppercase tracking-wide text-slate-500">AT</div>
        <div className="text-xs uppercase tracking-wide text-slate-500">PT</div>
        <div className="text-xs uppercase tracking-wide text-slate-500">WT</div>
        <div className="text-xs uppercase tracking-wide text-slate-500">TAT</div>

        {rows.map((r, idx) => (
          <React.Fragment key={r.id}>
            <input
              className="col-span-2 px-2 py-1 rounded-lg border"
              value={procs[idx].id}
              onChange={e => {
                const nx = [...procs];
                nx[idx] = { ...nx[idx], id: e.target.value || `P${idx + 1}` };
                setProcs(nx);
              }}
            />
            <input
              type="number"
              className="px-2 py-1 rounded-lg border"
              value={procs[idx].AT}
              onChange={e => {
                const nx = [...procs];
                nx[idx] = { ...nx[idx], AT: Number(e.target.value) };
                setProcs(nx);
              }}
            />
            <input
              type="number"
              className="px-2 py-1 rounded-lg border"
              value={procs[idx].PT}
              onChange={e => {
                const nx = [...procs];
                nx[idx] = { ...nx[idx], PT: Number(e.target.value) };
                setProcs(nx);
              }}
            />
            <div className="px-2 py-1 rounded-lg bg-slate-100 text-right">{nice(r.WT)}</div>
            <div className="px-2 py-1 rounded-lg bg-slate-100 text-right">{nice(r.TAT)}</div>
          </React.Fragment>
        ))}
      </div>

      <div className="mt-4 text-sm">
        Média WT: <b>{nice(avgWT)}</b> &nbsp; | &nbsp; Média TAT: <b>{nice(avgTAT)}</b>
      </div>
    </div>
  );
}

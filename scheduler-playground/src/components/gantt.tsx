import React from "react";
import type { Slice } from "../core";
import { bgFor } from "../lib/colors";

export default function Gantt({
  slices, minT, maxT, span,
}: {
  slices: Slice[];
  minT: number;
  maxT: number;
  span: number;
}) {
  const showLabel = (wPct: number, id: string) => id === "IDLE" || wPct >= 4;

  return (
    <section className="p-4 bg-white rounded-2xl shadow-sm border">
      <div className="font-semibold mb-4">Linha do tempo (Gantt)</div>

      <div className="relative">
        {/* Ticks */}
        <div className="flex items-center gap-2 text-xs text-slate-500 select-none">
          {Array.from({ length: span + 1 }, (_, k) => minT + k).map(tk => (
            <div key={tk} className="flex-1 text-center">{tk}</div>
          ))}
        </div>

        {/* Trilho */}
        <div className="mt-2 h-12 w-full bg-slate-100 rounded-xl overflow-hidden relative">
          {slices.map((s, idx) => {
            const widthPct = ((s.end - s.start) / span) * 100;
            const leftPct  = ((s.start - minT) / span) * 100;
            const isFirst  = idx === 0;
            const isLast   = idx === slices.length - 1;

            return (
              <div
                key={`${s.id}-${idx}`}
                className="absolute top-0 bottom-0"
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  minWidth: s.id === "IDLE" ? "6px" : undefined,   // 👈 garante que aparece
                  backgroundColor: bgFor(s.id),
                  borderTopLeftRadius:  isFirst ? 12 : 0,
                  borderBottomLeftRadius: isFirst ? 12 : 0,
                  borderTopRightRadius: isLast ? 12 : 0,
                  borderBottomRightRadius: isLast ? 12 : 0,
                }}
                title={`${s.id} (${s.start}→${s.end})`}
              >
                {showLabel(widthPct, s.id) && (
                  <div
                    className="h-full w-full flex items-center justify-center text-xs font-semibold"
                    style={{ color: s.id === "IDLE" ? "#1f2937" : "#ffffff" }} // texto escuro no IDLE
                  >
                    {s.id}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>{minT}</span>
          <span>{maxT}</span>
        </div>
      </div>
    </section>
  );
}

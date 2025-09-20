import React from "react";

type Algo = "FIFO" | "RR";

export default function Controls({
  algo, setAlgo, quantum, setQuantum,
}: {
  algo: Algo;
  setAlgo: (a: Algo) => void;
  quantum: number;
  setQuantum: (q: number) => void;
}) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border">
      <div className="font-semibold mb-3">Algoritmo</div>
      <div className="flex gap-3">
        {(["FIFO", "RR"] as Algo[]).map(a => (
          <button
            key={a}
            onClick={() => setAlgo(a)}
            className={`px-3 py-1.5 rounded-xl border transition ${
              algo === a ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-100"
            }`}
          >
            {a}
          </button>
        ))}
      </div>
      {algo === "RR" && (
        <div className="mt-4">
          <label className="block text-sm mb-1">Quantum</label>
          <input
            type="number"
            min={1}
            value={quantum}
            onChange={e => setQuantum(Math.max(1, Number(e.target.value)))}
            className="w-24 px-3 py-1.5 rounded-lg border focus:outline-none focus:ring"
          />
        </div>
      )}
    </div>
  );
}

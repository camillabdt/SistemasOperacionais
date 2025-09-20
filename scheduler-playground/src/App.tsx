import React, { useMemo, useState } from "react";
import { computeFIFO, computeRR, computeMetrics, type Proc, type Slice } from "./core";
import Controls from "./components/controls";
import ProcessTable from "./components/processTable";
import Gantt from "./components/gantt";

type Algo = "FIFO" | "RR";

export default function App() {
  const [algo, setAlgo] = useState<Algo>("RR");
  const [quantum, setQuantum] = useState<number>(5);
  const [procs, setProcs] = useState<Proc[]>([
    { id: "P1", AT: 1, PT: 7 },
    { id: "P2", AT: 3, PT: 12 },
    { id: "P3", AT: 5, PT: 6 },
    { id: "P4", AT: 8, PT: 9 },
    { id: "P5", AT: 10, PT: 5 },
  ]);

  const slices = useMemo<Slice[]>(() => (
    algo === "FIFO" ? computeFIFO(procs) : computeRR(procs, quantum)
  ), [algo, procs, quantum]);

  const { rows, avgTAT, avgWT } = useMemo(
    () => computeMetrics(slices, procs),
    [slices, procs]
  );

  // régua sempre começa em 0
  const minT = 0;
  const maxT = Math.max(1, ...slices.map(s => s.end));
  const span = Math.max(1, maxT - minT);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 text-slate-800 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            SO Scheduler Playground — FIFO & Round Robin
          </h1>
          <div className="text-sm opacity-70">
            Quantum RR atual: <b>{quantum}</b>
          </div>
        </header>

        <section className="grid md:grid-cols-3 gap-4">
          <Controls algo={algo} setAlgo={setAlgo} quantum={quantum} setQuantum={setQuantum} />
          <ProcessTable procs={procs} setProcs={setProcs} rows={rows} avgWT={avgWT} avgTAT={avgTAT} />
        </section>

        <Gantt slices={slices} minT={minT} maxT={maxT} span={span} />

        <section className="p-4 bg-white rounded-2xl shadow-sm border">
          <div className="font-semibold mb-2">Como usar</div>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Altere <b>Algoritmo</b> entre FIFO e Round Robin. Em RR, ajuste o <b>Quantum</b>.</li>
            <li>Edite <b>AT</b> (chegada) e <b>PT</b> (burst); gráficos e métricas recalculam na hora.</li>
            <li>Passe o mouse nos blocos para ver <i>start→end</i>. A barra cinza indica períodos ociosos (IDLE).</li>
          </ul>
        </section>

        <footer className="text-xs text-slate-500 pt-2">Feito com React + Tailwind. // Esse trabalho foi feito por Camilla, Emanuel, Fabiano e Gabriel. Para a disciplina de Sistemas Operacionais do curso de Engenharia de Software da UNIPAMPA </footer>
      </div>
    </div>
  );
}

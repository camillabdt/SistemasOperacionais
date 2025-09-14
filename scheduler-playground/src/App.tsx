/**
 * SO Scheduler Playground — Guia comentado do código
 * --------------------------------------------------
 * Este arquivo demonstra escalonamento FIFO e Round Robin (RR) com um Gantt interativo.
 * Abaixo, cada parte possui um bloco explicando o papel, a lógica e dicas para estudo/slide.
 */
import React, { useMemo, useState } from "react";

// === Helper types ===
/**
 * Tipos base usados em todo o arquivo:
 * - Proc: descreve um processo (id, AT=Arrival Time, PT=Processing/Burst Time).
 * - Slice: um trecho de execução no Gantt, com início/fim e qual processo o ocupa.
 *
 * Observação didática: manter tipos mínimos e semânticos facilita o cálculo das métricas.
 */
type Proc = { id: string; AT: number; PT: number };
type Slice = { id: string; start: number; end: number };

type Algo = "FIFO" | "RR";

// === Core scheduling logic ===
/**
 * computeFIFO(processes): Slice[]
 * -------------------------------
 * Implementa o algoritmo FIFO (First-In, First-Out).
 * 1) Ordena processos por tempo de chegada (AT).
 * 2) Avança o relógio lógico (t). Se houver lacuna entre t e o próximo AT, registra um Slice "IDLE".
 * 3) Para cada processo, cria um Slice contínuo de tamanho PT (sem preempção).
 *
 * Complexidade (dominado pela ordenação): O(n log n).
 * Excelente para didática por não ter preempção; porém sofre com efeito "convoy".
 */
function computeFIFO(processes: Proc[]): Slice[] {
  const procs = [...processes].sort((a, b) => (a.AT - b.AT) || a.id.localeCompare(b.id));
  const slices: Slice[] = [];
  let t = Math.min(...procs.map(p => p.AT));
  for (const p of procs) {
    if (t < p.AT) {
      // idle gap
      slices.push({ id: "IDLE", start: t, end: p.AT });
      t = p.AT;
    }
    slices.push({ id: p.id, start: t, end: t + p.PT });
    t += p.PT;
  }
  return slices;
}

/**
 * computeRR(processes, q): Slice[]
 * -------------------------------
 * Round Robin com quantum q.
 * 1) Ordena por AT e usa uma fila de prontos (rq).
 * 2) Sempre que possível, executa a cabeça da fila por min(q, restante).
 * 3) Enquanto executa, admite novos chegados (AT <= end do slice atual).
 * 4) Se o processo não terminou, volta ao fim da fila com o tempo restante.
 * 5) Se a fila esvaziar mas ainda faltam chegadas futuras, insere Slice "IDLE" e pula t para o próximo AT.
 *
 * Invariantes úteis para entendimento: t sempre avança, remaining guarda tempos restantes, e i percorre chegadas.
 * Complexidade: O(n log n) pela ordenação + O(total de fatias) para o loop principal.
 */
function computeRR(processes: Proc[], q: number): Slice[] {
  const procs = [...processes].sort((a, b) => (a.AT - b.AT) || a.id.localeCompare(b.id));
  const remaining = new Map<string, number>(procs.map(p => [p.id, p.PT]));
  const slices: Slice[] = [];
  let i = 0; // next arrival index
  let t = procs.length ? procs[0].AT : 0;
  const rq: string[] = [];
  if (procs.length) rq.push(procs[i++].id);

  while (rq.length || i < procs.length) {
    if (!rq.length && i < procs.length) {
      // jump to next arrival
      const nextT = procs[i].AT;
      if (t < nextT) slices.push({ id: "IDLE", start: t, end: nextT });
      t = nextT;
      rq.push(procs[i++].id);
      continue;
    }
    const pid = rq.shift()!;
    const rem = remaining.get(pid)!;
    const slice = Math.min(q, rem);
    const start = t;
    const end = start + slice;
    slices.push({ id: pid, start, end });

    // enqueue any arrivals up to 'end'
    while (i < procs.length && procs[i].AT <= end) {
      rq.push(procs[i].id);
      i++;
    }

    const newRem = rem - slice;
    remaining.set(pid, newRem);
    t = end;
    if (newRem > 0) rq.push(pid);
  }
  return slices;
}

/**
 * computeMetrics(slices, procs)
 * -----------------------------
 * Constrói métricas clássicas por processo e médias:
 * - Finish time (FT): último 'end' do processo no Gantt.
 * - TAT (Turnaround): FT - AT.
 * - WT (Waiting): TAT - PT.
 * A função também retorna médias WT/TAT para comparação entre algoritmos.
 */
function computeMetrics(slices: Slice[], procs: Proc[]) {
  // Finish time = last end for each pid
  const finish = new Map<string, number>();
  for (const s of slices) if (s.id !== "IDLE") finish.set(s.id, s.end);
  const rows = procs.map(p => {
    const FT = finish.get(p.id) ?? 0;
    const TAT = FT - p.AT; // turnaround
    const WT = TAT - p.PT; // waiting
    return { id: p.id, start: slices.find(s => s.id === p.id)?.start ?? p.AT, finish: FT, WT, TAT };
  });
  const avgTAT = rows.reduce((a, r) => a + r.TAT, 0) / rows.length;
  const avgWT = rows.reduce((a, r) => a + r.WT, 0) / rows.length;
  return { rows, avgTAT, avgWT };
}

// === Pretty helpers ===
/**
 * Paleta e helpers visuais
 * ------------------------
 * - palette: classes Tailwind para cores dos blocos.
 * - colorFor(id): mapeia P1..Pn para cores consistentes; usa cinza para períodos IDLE.
 */
const palette = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-fuchsia-500",
  "bg-cyan-500",
  "bg-lime-500",
  "bg-rose-500",
  "bg-indigo-500",
];
function colorFor(id: string) {
  if (id === "IDLE") return "bg-zinc-300";
  const n = id.replace(/[^0-9]/g, "");
  const idx = (parseInt(n || "0", 10) - 1) % palette.length;
  return palette[idx];
}

/**
 * nice(num): formata WT/TAT para exibição (sem casas desnecessárias).
 */
function nice(num: number) {
  return Number.isInteger(num) ? num.toString() : num.toFixed(1);
}

// === Main component ===
/**
 * Componente principal: SchedulerPlayground
 * ----------------------------------------
 * Estado local:
 *  - algo: algoritmo escolhido ("FIFO" | "RR").
 *  - quantum: fatia de tempo do RR.
 *  - procs: lista editável de processos (id, AT, PT).
 *
 * Derivados com useMemo:
 *  - slices: Gantt (lista de trechos) calculada por computeFIFO/computeRR.
 *  - rows, avgTAT, avgWT: métricas vindas de computeMetrics.
 *
 * Renderização:
 *  - Controles (algoritmo/quantum).
 *  - Tabela editável de processos + colunas WT/TAT já calculadas.
 *  - Gráfico Gantt: cada Slice vira um <div> com largura proporcional ao (end - start).
 *  - Dicas de uso para relatório/apresentação.
 */
export default function SchedulerPlayground() {
  const [algo, setAlgo] = useState<Algo>("FIFO");
  const [quantum, setQuantum] = useState<number>(5);
  const [procs, setProcs] = useState<Proc[]>([
    { id: "P1", AT: 1, PT: 7 },
    { id: "P2", AT: 3, PT: 12 },
    { id: "P3", AT: 5, PT: 6 },
    { id: "P4", AT: 8, PT: 9 },
    { id: "P5", AT: 10, PT: 5 },
  ]);

  const slices = useMemo(() => {
    return algo === "FIFO" ? computeFIFO(procs) : computeRR(procs, quantum);
  }, [algo, procs, quantum]);

  const { rows, avgTAT, avgWT } = useMemo(() => computeMetrics(slices, procs), [slices, procs]);

  const minT = Math.min(...procs.map(p => p.AT));
  const maxT = Math.max(...slices.map(s => s.end), minT + 1);
  const span = maxT - minT || 1;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 text-slate-800 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">SO Scheduler Playground — FIFO & Round Robin</h1>
          <div className="text-sm opacity-70">Quantum RR atual: <b>{quantum}</b></div>
        </header>

        {/* Controls */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm border">
            <div className="font-semibold mb-3">Algoritmo</div>
            <div className="flex gap-3">
              {(["FIFO", "RR"] as Algo[]).map(a => (
                <button
                  key={a}
                  onClick={() => setAlgo(a)}
                  className={`px-3 py-1.5 rounded-xl border ${algo === a ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-100"}`}
                >{a}</button>
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
                      const nx = [...procs]; nx[idx] = { ...nx[idx], id: e.target.value || `P${idx+1}` }; setProcs(nx);
                    }}
                  />
                  <input
                    type="number"
                    className="px-2 py-1 rounded-lg border"
                    value={procs[idx].AT}
                    onChange={e => { const nx = [...procs]; nx[idx] = { ...nx[idx], AT: Number(e.target.value) }; setProcs(nx); }}
                  />
                  <input
                    type="number"
                    className="px-2 py-1 rounded-lg border"
                    value={procs[idx].PT}
                    onChange={e => { const nx = [...procs]; nx[idx] = { ...nx[idx], PT: Number(e.target.value) }; setProcs(nx); }}
                  />
                  <div className="px-2 py-1 rounded-lg bg-slate-100 text-right">{nice(r.WT)}</div>
                  <div className="px-2 py-1 rounded-lg bg-slate-100 text-right">{nice(r.TAT)}</div>
                </React.Fragment>
              ))}
            </div>

            <div className="mt-4 text-sm">
              <div>Média WT: <b>{nice(avgWT)}</b> &nbsp; | &nbsp; Média TAT: <b>{nice(avgTAT)}</b></div>
            </div>
          </div>
        </section>

        {/* Timeline / Gantt */}
        <section className="p-4 bg-white rounded-2xl shadow-sm border">
          <div className="font-semibold mb-4">Linha do tempo (Gantt)</div>
          {/* Scale */}
          <div className="relative">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {Array.from({ length: span + 1 }, (_, k) => minT + k).map(tk => (
                <div key={tk} className="flex-1 text-center">{tk}</div>
              ))}
            </div>
            <div className="mt-2 h-12 w-full bg-slate-100 rounded-xl overflow-hidden flex">
              {slices.map((s, idx) => {
                const pct = ((s.end - s.start) / span) * 100;
                const offset = ((s.start - minT) / span) * 100;
                return (
                  <div
                    key={idx}
                    className={`h-full ${colorFor(s.id)} relative rounded-none`}
                    style={{ width: `${pct}%`, marginLeft: idx === 0 ? `${offset}%` : undefined }}
                    title={`${s.id} (${s.start}→${s.end})`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold drop-shadow-sm">
                      {s.id}
                    </div>
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

        {/* How it works */}
        <section className="p-4 bg-white rounded-2xl shadow-sm border">
          <div className="font-semibold mb-2">Como usar</div>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Altere <b>Algoritmo</b> entre FIFO e Round Robin. Em RR, ajuste o <b>Quantum</b>.</li>
            <li>Edite <b>AT</b> (chegada) e <b>PT</b> (burst) de cada processo; os gráficos e métricas recalculam na hora.</li>
            <li>Passe o mouse nos blocos para ver <i>start→end</i>. A barra cinza indica períodos ociosos (IDLE).</li>
          </ul>
        </section>

        <footer className="text-xs text-slate-500 pt-2">Feito com React + Tailwind. Camilla, Emanuel e Fabiano- 2025 Engenharia de Software - UNIPAMPA.</footer>
      </div>
    </div>
  );
}

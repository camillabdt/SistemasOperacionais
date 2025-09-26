import { Proc, Slice } from "./types";

// Função para calcular métricas de escalonamento (turnaround time e waiting time)
export function computeMetrics(slices: Slice[], procs: Proc[]) {
  // Mapeia o instante de término (finish time) de cada processo
  // Usa um Map onde a chave é o id do processo e o valor é o instante final
  const finish = new Map<string, number>();
  for (const s of slices) 
    if (s.id !== "IDLE") // ignora fatias de CPU ociosa
      finish.set(s.id, s.end);

  // Calcula as métricas para cada processo
  const rows = procs.map((p) => {
    const FT = finish.get(p.id) ?? 0; // Finish Time: último instante do processo (ou 0 se não encontrado)
    const TAT = FT - p.AT;            // Turnaround Time = tempo total até terminar (FT - Arrival Time)
    const WT  = TAT - p.PT;           // Waiting Time = tempo de espera (TAT - tempo de processamento)

    // Descobre o instante em que o processo começou a ser executado
    // Se não achar nas slices, assume o Arrival Time
    const first = slices.find((s) => s.id === p.id)?.start ?? p.AT;

    return { id: p.id, start: first, finish: FT, WT, TAT };
  });

  // Calcula médias (Turnaround médio e Waiting Time médio)
  const avgTAT = rows.reduce((a, r) => a + r.TAT, 0) / (rows.length || 1);
  const avgWT  = rows.reduce((a, r) => a + r.WT , 0) / (rows.length || 1);

  // Retorna resultados individuais (rows) e médias
  return { rows, avgTAT, avgWT };
}

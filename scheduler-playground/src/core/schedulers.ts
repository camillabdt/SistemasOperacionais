import { Proc, Slice } from "./types";

// Algoritmo FIFO (First-In, First-Out)
export function computeFIFO(processes: Proc[]): Slice[] {
  // Ordena os processos por tempo de chegada (AT) e, em caso de empate, pelo id
  const procs = [...processes].sort((a, b) => (a.AT - b.AT) || a.id.localeCompare(b.id));
  const slices: Slice[] = [];
  let t = 0; // relógio global do escalonador

  for (const p of procs) {
    // Se o processo ainda não chegou, insere um intervalo "IDLE" (CPU ociosa)
    if (t < p.AT) { 
      slices.push({ id: "IDLE", start: t, end: p.AT });
      t = p.AT; // avança o tempo até a chegada do processo
    }
    // Executa o processo até terminar
    slices.push({ id: p.id, start: t, end: t + p.PT });
    t += p.PT; // atualiza o tempo global
  }
  return slices; // retorna a sequência de fatias de execução
}


// Algoritmo Round Robin (RR)
export function computeRR(processes: Proc[], q: number): Slice[] {
  // Ordena os processos por tempo de chegada (AT) e, em caso de empate, pelo id
  const procs = [...processes].sort((a, b) => (a.AT - b.AT) || a.id.localeCompare(b.id));

  // Mapa para controlar quanto tempo resta de execução para cada processo
  const remaining = new Map<string, number>(procs.map(p => [p.id, p.PT]));

  const slices: Slice[] = [];
  let i = 0, t = 0;  // i percorre os processos ordenados, t é o tempo global
  const rq: string[] = []; // fila de prontos (ready queue)

  // Inicializa a fila de prontos com processos que já chegaram no tempo 0
  while (i < procs.length && procs[i].AT <= t) rq.push(procs[i++].id);

  // Enquanto houver processos na fila ou processos que ainda não chegaram
  while (rq.length || i < procs.length) {
    // Caso a fila esteja vazia mas ainda existam processos futuros
    if (!rq.length) {
      const nextT = procs[i].AT; // próximo tempo de chegada
      if (t < nextT) slices.push({ id: "IDLE", start: t, end: nextT }); // CPU ociosa
      t = nextT; 
      // adiciona todos os processos que já chegaram até esse instante
      while (i < procs.length && procs[i].AT <= t) rq.push(procs[i++].id);
      continue; // volta para o loop
    }

    // Pega o próximo processo da fila
    const pid = rq.shift()!;
    const rem = remaining.get(pid)!; // tempo restante
    const run = Math.min(q, rem);    // quanto ele vai rodar nesse "quantum"
    const start = t, end = start + run;

    // Adiciona fatia de execução
    slices.push({ id: pid, start, end });
    t = end;

    // Adiciona novos processos que chegaram nesse intervalo
    while (i < procs.length && procs[i].AT <= t) rq.push(procs[i++].id);

    // Atualiza o tempo restante
    const newRem = rem - run;
    remaining.set(pid, newRem);

    // Se ainda restar tempo, reenvia o processo para o final da fila
    if (newRem > 0) rq.push(pid);
  }
  return slices; // retorna a sequência de fatias de execução
}

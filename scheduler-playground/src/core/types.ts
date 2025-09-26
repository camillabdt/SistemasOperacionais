// Representa um processo
export type Proc = { 
  id: string;   // Identificador único do processo (ex: "P1")
  AT: number;   // Arrival Time (tempo de chegada)
  PT: number;   // Processing Time (tempo total de execução necessário)
};

// Representa uma "fatia" de execução no tempo
export type Slice = { 
  id: string;    // Identificador do processo (ou "IDLE" quando CPU está ociosa)
  start: number; // Instante em que começa a execução
  end: number;   // Instante em que termina a execução
};

// Define quais algoritmos de escalonamento podem ser usados
export type Algo = "FIFO" | "RR";

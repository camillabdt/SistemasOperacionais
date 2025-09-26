import React from "react";

type Algo = "FIFO" | "RR"; // Tipos possíveis de algoritmos

// Componente principal
export default function Controls({
  algo, setAlgo, quantum, setQuantum,
}: {
  algo: Algo;                     // Algoritmo selecionado atualmente
  setAlgo: (a: Algo) => void;     // Função para atualizar o algoritmo
  quantum: number;                // Valor atual do quantum (apenas para RR)
  setQuantum: (q: number) => void;// Função para atualizar o quantum
}) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border">
      {/* Título da seção */}
      <div className="font-semibold mb-3">Algoritmo</div>

      {/* Botões para escolher entre FIFO e RR */}
      <div className="flex gap-3">
        {(["FIFO", "RR"] as Algo[]).map(a => (
          <button
            key={a}
            onClick={() => setAlgo(a)} // Atualiza o algoritmo selecionado
            className={`px-3 py-1.5 rounded-xl border transition ${
              algo === a 
                ? "bg-slate-900 text-white" // Se for o selecionado → estilo ativo
                : "bg-white hover:bg-slate-100" // Se não for → estilo padrão
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Se o algoritmo selecionado for Round Robin, mostra o campo para o quantum */}
      {algo === "RR" && (
        <div className="mt-4">
          <label className="block text-sm mb-1">Quantum</label>
          <input
            type="number"
            min={1} // quantum não pode ser menor que 1
            value={quantum}
            onChange={e => setQuantum(Math.max(1, Number(e.target.value)))} 
            // garante que o valor seja ao menos 1
            className="w-24 px-3 py-1.5 rounded-lg border focus:outline-none focus:ring"
          />
        </div>
      )}
    </div>
  );
}

# 🖥️ SO Scheduler Playground — FIFO & Round Robin


<p align="center">
  <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGh2cmtyY3owOGh6YWtoYTBjejU5MmJxc2h5dHFuanM5a21jZ2UyaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Qu8EXhxJVvDMAsOwAS/giphy.gif" 
       width="220" alt="SO Gif" />
</p>


[![Made with React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/) 
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/) 
[![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)](https://vite.dev/) 

Aplicação interativa para **simular algoritmos de escalonamento de processos**  
em **Sistemas Operacionais**, com suporte a:

- ✅ **FIFO (First In, First Out)**
- ✅ **Round Robin (RR)** com Quantum configurável

---

## 🎯 Funcionalidades

- Visualização em tempo real do **gráfico de Gantt**  
- Cálculo automático de:
  - WT (*Waiting Time*)
  - TAT (*Turnaround Time*)
  - Médias de WT e TAT
- Edição dinâmica de **AT (Arrival Time)** e **PT (Burst Time)**
- Destaque visual para períodos **ociosos (IDLE)**  
- Interface moderna feita com **React + TailwindCSS**

---

## 🚀 Demonstração

![screenshot](./docs/screenshot.png)

---

## 🛠️ Como rodar

### 1) Clonar o repositório
```bash
git clone https://github.com/seu-usuario/scheduler-playground.git
cd scheduler-playground

### 2) Instalar dependências
npm install

### 3) Rodar em modo desenvolvimento
npm run dev

O Vite irá abrir em http://localhost:5173/

📂 Estrutura do projeto
csharp
Copiar código
scheduler-playground/
├── public/              # arquivos estáticos
├── src/
│   ├── core/            # lógica pura (algoritmos, métricas, tipos)
│   ├── components/      # UI modular (Controls, ProcessTable, Gantt)
│   ├── App.tsx          # orquestrador principal
│   ├── main.tsx         # ponto de entrada
│   └── index.css        # estilos com Tailwind
├── index.html
├── vite.config.ts
└── package.json


📖 Conteúdo educacional
Este projeto foi feito para fins didáticos, em apoio ao estudo de Sistemas Operacionais.

📜 Licença
Sinta-se livre para usar, modificar e compartilhar! 🤝


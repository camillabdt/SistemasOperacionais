/** @type {import('tailwindcss').Config} */
export default {
  // (em v4 o content é opcional; o importante aqui é o safelist)
  safelist: [
    { pattern: /bg-(blue|emerald|amber|fuchsia|cyan|lime|rose|indigo)-500/ },
    "bg-zinc-300",
  ],
};

const palette = [
  "#3b82f6", "#10b981", "#f59e0b", "#d946ef",
  "#06b6d4", "#84cc16", "#f43f5e", "#6366f1",
];

export function bgFor(id: string): string {
  if (id === "IDLE") return "#9ca3af"; // gray-400 (mais escuro que antes)
  const match = id.match(/\d+/)?.[0];
  const num = match ? parseInt(match, 10) : 1;
  const idx = (num - 1) % palette.length;
  return palette[idx];
}

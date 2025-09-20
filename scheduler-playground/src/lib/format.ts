export function nice(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

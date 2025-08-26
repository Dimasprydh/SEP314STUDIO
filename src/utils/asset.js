export function asset(p = "") {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const path = String(p).replace(/^\//, "");
  return `${base}/${path}`;
}

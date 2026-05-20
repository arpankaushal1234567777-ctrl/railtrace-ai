export function detectQueryType(query: string) {
  const q = query.trim();

  if (/^\d{10}$/.test(q)) {
    return "pnr";
  }

  if (/^\d{4,5}$/.test(q)) {
    return "train";
  }

  if (/^[A-Z]{2,5}$/.test(q)) {
    return "station";
  }

  return "general";
}

export function getStatusColor(status: string) {
  const s = status.toLowerCase();

  if (s.includes("live")) return "live";
  if (s.includes("running")) return "live";
  if (s.includes("on time")) return "live";

  if (s.includes("delay")) return "delayed";

  if (s.includes("cancel")) return "cancelled";

  if (s.includes("arrive")) return "arrived";

  return "default";
}
export function detectQueryType(query: string) {
  const q = query.trim().toUpperCase();

  // PNR
  if (/^\d{10}$/.test(q)) {
    return "pnr";
  }

  if (/^\d{3,6}$/.test(q)) {
  return "train";
}

  // Station Code
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
/** Tracks confirmed mainnet STRK20 tx hashes for strk20.json submission prep. */

export type RecordedTx = {
  hash: string;
  action: string;
  network: "MAINNET" | "SEPOLIA";
  recordedAt: string;
};

const STORAGE_KEY = "strk20-submission-txs";

export function loadRecordedTxs(): RecordedTx[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecordedTx[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordTx(entry: Omit<RecordedTx, "recordedAt">): RecordedTx[] {
  const next: RecordedTx = { ...entry, recordedAt: new Date().toISOString() };
  const existing = loadRecordedTxs();
  if (existing.some((t) => t.hash.toLowerCase() === entry.hash.toLowerCase())) {
    return existing;
  }
  const updated = [next, ...existing].slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function mainnetHashes(txs: RecordedTx[]): string[] {
  return txs.filter((t) => t.network === "MAINNET").map((t) => t.hash);
}

export function strk20JsonSnippet(txs: RecordedTx[]): string {
  return JSON.stringify({ transactions: mainnetHashes(txs) }, null, 2);
}

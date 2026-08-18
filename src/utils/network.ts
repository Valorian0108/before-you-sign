import { constants as SNconstants, num } from "starknet";

export type Strk20NetworkIndex = 0 | 2;

export const STRK20_NETWORKS: Record<Strk20NetworkIndex, { label: string; chainId: string }> = {
  0: { label: "MAINNET", chainId: SNconstants.StarknetChainId.SN_MAIN },
  2: { label: "SEPOLIA", chainId: SNconstants.StarknetChainId.SN_SEPOLIA },
};

export function normalizeChainId(chainId: string): string {
  try {
    return num.toHex(chainId).toLowerCase();
  } catch {
    return chainId.toLowerCase();
  }
}

export function providerIndexForChainId(chainId: string): Strk20NetworkIndex | null {
  const hex = normalizeChainId(chainId);
  if (hex === normalizeChainId(SNconstants.StarknetChainId.SN_MAIN)) return 0;
  if (hex === normalizeChainId(SNconstants.StarknetChainId.SN_SEPOLIA)) return 2;
  return null;
}

export function networkLabel(index: number): string | undefined {
  return STRK20_NETWORKS[index as Strk20NetworkIndex]?.label;
}

export function isStrk20NetworkIndex(index: number): index is Strk20NetworkIndex {
  return index === 0 || index === 2;
}

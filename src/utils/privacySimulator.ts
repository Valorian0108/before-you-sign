/**
 * Ground-truth visibility model for STRK20 transactions.
 * Source: STRK20 protocol design — must stay accurate; overclaiming costs judging points.
 */

export type PrivacyActionType = "shield" | "transfer" | "unshield";

export type VisibilityLevel = "public" | "hidden" | "conditional";

export type VisibilityItem = {
  field: string;
  level: VisibilityLevel;
  observer: string;
  detail: string;
};

export type PrivacySimulation = {
  action: PrivacyActionType;
  actionLabel: string;
  amountLabel: string;
  networkFee: string;
  summary: string;
  visible: VisibilityItem[];
  hidden: VisibilityItem[];
  conditional: VisibilityItem[];
  tips: string[];
};

const SHIELDED_TX_COST = "4 STRK";

function baseHidden(): VisibilityItem[] {
  return [
    {
      field: "Note contents",
      level: "hidden",
      observer: "Any public observer",
      detail:
        "Amount inside the note is masked with a Poseidon key stream. Only the intended recipient can recover the real value.",
    },
    {
      field: "Which notes were spent",
      level: "hidden",
      observer: "Any public observer",
      detail:
        "UTXO-style notes are spent via one-time nullifiers. The chain proves validity without revealing which specific notes were consumed.",
    },
    {
      field: "ZK proof contents",
      level: "hidden",
      observer: "Any public observer",
      detail:
        "Starknet only verifies that a valid zero-knowledge proof exists — never what is inside it.",
    },
    {
      field: "Note discovery path",
      level: "hidden",
      observer: "Any public observer",
      detail:
        "Recipients derive note locations from a shared secret with the sender. No global chain scan is required or exposed.",
    },
  ];
}

function complianceConditional(): VisibilityItem[] {
  return [
    {
      field: "Your history under legal request",
      level: "conditional",
      observer: "Authorized auditor (compliance layer)",
      detail:
        "At first deposit you register a mandatory encrypted viewing key. Under a legitimate legal request, an independent auditor key can decrypt one specific user's history — without exposing anyone else in the pool.",
    },
  ];
}

export function simulatePrivacy(params: {
  action: PrivacyActionType;
  amountLabel: string;
  recipientShort?: string;
  isSelfTransfer?: boolean;
}): PrivacySimulation {
  const { action, amountLabel, recipientShort, isSelfTransfer } = params;

  if (action === "shield") {
    return {
      action,
      actionLabel: "Shield (deposit into pool)",
      amountLabel,
      networkFee: SHIELDED_TX_COST,
      summary:
        "You move funds from your public balance into the STRK20 privacy pool. Entry from a public address is linkable; once inside, activity is shielded.",
      visible: [
        {
          field: "Your public address → pool deposit",
          level: "public",
          observer: "Any public observer",
          detail: `A deposit of ${amountLabel} from your connected wallet into the STRK20 pool is visible on-chain. This links your public identity to having entered the pool.`,
        },
        {
          field: "Encrypted note created",
          level: "public",
          observer: "Any public observer",
          detail:
            "An encrypted note is written to chain storage. Observers see that a note exists, not who owns it or how much it holds.",
        },
        {
          field: "Protocol metadata & proof verification",
          level: "public",
          observer: "Any public observer",
          detail: "Required protocol metadata and proof validity are verified on-chain.",
        },
        {
          field: "Viewing key registration",
          level: "public",
          observer: "Protocol (first deposit)",
          detail:
            "Your first shield registers your mandatory encrypted viewing key with the compliance layer.",
        },
      ],
      hidden: [
        ...baseHidden(),
        {
          field: "Future in-pool activity linkage",
          level: "hidden",
          observer: "Any public observer",
          detail:
            "After this deposit, private transfers and unshields do not reveal sender, receiver, or amount on-chain.",
        },
      ],
      conditional: complianceConditional(),
      tips: [
        "Shielding is the main link between your public wallet and the privacy pool — plan entry timing if that matters to you.",
        "Anyone analyzing the chain can see that you deposited; they cannot see what you do inside the pool afterward.",
      ],
    };
  }

  if (action === "transfer") {
    return {
      action,
      actionLabel: isSelfTransfer ? "Private transfer (to self)" : "Private transfer",
      amountLabel,
      networkFee: SHIELDED_TX_COST,
      summary:
        "Funds move between shielded notes inside the pool. A public observer sees encrypted activity, not who sent what to whom.",
      visible: [
        {
          field: "Encrypted note(s) created",
          level: "public",
          observer: "Any public observer",
          detail: "New encrypted notes appear in pool storage.",
        },
        {
          field: "Nullifier(s) published",
          level: "public",
          observer: "Any public observer",
          detail:
            "Spent notes are marked with one-time nullifiers so they cannot be double-spent. Nullifiers do not reveal note contents.",
        },
        {
          field: "Proof validity",
          level: "public",
          observer: "Any public observer",
          detail: "The chain confirms a valid STARK proof was submitted.",
        },
      ],
      hidden: [
        {
          field: "Sender",
          level: "hidden",
          observer: "Any public observer",
          detail: "Not exposed on-chain for in-pool private transfers.",
        },
        {
          field: "Receiver",
          level: "hidden",
          observer: "Any public observer",
          detail: recipientShort
            ? `Recipient (${recipientShort}) is not revealed on-chain — only they can discover and decrypt the note.`
            : "Not exposed on-chain.",
        },
        {
          field: "Amount",
          level: "hidden",
          observer: "Any public observer",
          detail: `${amountLabel} is encrypted inside the note.`,
        },
        ...baseHidden(),
      ],
      conditional: complianceConditional(),
      tips: [
        "Timing correlation with other pool activity can weaken privacy in practice — vary timing when possible.",
        "Self-transfers still cost 4 STRK and appear as pool activity, but do not link public addresses.",
      ],
    };
  }

  // unshield
  return {
    action,
    actionLabel: "Unshield (withdraw to public)",
    amountLabel,
    networkFee: SHIELDED_TX_COST,
    summary:
      "Shielded notes are spent inside the pool, then funds exit to a public address. The exit is visible; the in-pool spend is not.",
    visible: [
      {
        field: "Withdrawal recipient & amount",
        level: "public",
        observer: "Any public observer",
        detail: recipientShort
          ? `${amountLabel} withdrawn to ${recipientShort} is visible when funds return to the public layer.`
          : `${amountLabel} withdrawn to the chosen public address is visible on exit.`,
      },
      {
        field: "Nullifier(s) published",
        level: "public",
        observer: "Any public observer",
        detail: "Spent shielded notes are nullified on-chain without revealing which notes they were.",
      },
      {
        field: "Proof validity",
        level: "public",
        observer: "Any public observer",
        detail: "The chain confirms a valid STARK proof was submitted.",
      },
    ],
    hidden: [
      {
        field: "Which shielded notes funded this withdrawal",
        level: "hidden",
        observer: "Any public observer",
        detail: "The specific in-pool notes spent are not revealed.",
      },
      {
        field: "In-pool sender identity",
        level: "hidden",
        observer: "Any public observer",
        detail: "Who held the shielded balance before withdrawal is not exposed.",
      },
      ...baseHidden(),
    ],
    conditional: complianceConditional(),
    tips: [
      "Unshielding reveals the destination address and amount — this is the exit link from the privacy pool.",
      "If you re-shield later, a new deposit creates a fresh (potentially linkable) entry event.",
    ],
  };
}

# STRK20 Transaction Transparency Simulator

Show someone exactly what a private STRK20 transaction will reveal — and what it won't — **before they sign it**.

Built for the [Starknet Private Sprint](https://strk20.starknet.io/hackathon) (August 2026).

## What it does

1. Configure a real STRK20 action (shield, private send, or unshield).
2. Open the **privacy preview** — an honest before/after breakdown grounded in how STRK20 actually works.
3. Sign and execute the transaction through your privacy-enabled wallet (Ready).

The simulator never overclaims privacy. It includes the compliance layer (mandatory viewing keys, auditor access under legal request) and real costs (4 STRK per shielded transaction).

## Quick start

```bash
npm install
cp .env.example .env.local   # add your Alchemy Starknet RPC key
npm run dev                    # http://localhost:3000
```

**Live Demo**: https://before-you-sign-seven.vercel.app/

### Requirements

- Node.js 18+
- Free [Alchemy](https://alchemy.com) Starknet RPC key → `NEXT_PUBLIC_PROVIDER_URL` in `.env.local`
- [Ready](https://ready.gg/) wallet extension on **Sepolia** (test) or **Mainnet**
- STRK for testnet/mainnet transactions (4 STRK per shielded tx + amounts)

## Privacy model (summary)

| Observer sees | Observer never sees |
|---|---|
| Encrypted notes & nullifiers | Sender / receiver (in-pool transfers) |
| Proof validity (not contents) | Amount inside notes |
| Shield entry from your public address | Which specific notes were spent |
| Unshield exit to public address + amount | ZK proof contents |

See `src/utils/privacySimulator.ts` for the full per-action breakdown.

## Project structure

| Path | Purpose |
|---|---|
| `src/utils/privacySimulator.ts` | Ground-truth visibility model per action |
| `src/app/components/PrivacyPreview.tsx` | Pre-sign preview UI |
| `src/app/components/client/WalletHandle/WalletAccountV6Tag.tsx` | Wallet + STRK20 actions |
| `strk20.json` | Hackathon submission metadata (tx hashes, demo video) |

## Hackathon submission (`strk20.json`)

```json
{
  "transactions": ["0x...", "0x...", "0x..."],
  "contracts": [],
  "demo_video": "https://youtu.be/...",
  "demo_url": "https://your-deployed-demo.example"
}
```

- At least **3 mainnet** transaction hashes touching the STRK20 pool
- **3-minute demo video**
- Live demo URL (or set repo Website / GitHub Pages)

## Deploy

Standard Next.js — [Vercel](https://vercel.com/new), Replit, or similar. Set `NEXT_PUBLIC_PROVIDER_URL` in environment variables.

## Resources

- [STRK20 starter kit](https://github.com/Akashneelesh/strk20-starter-kit) (base)
- [STRK20 by example](https://strk20-by-example.org/)
- [Privacy SDK](https://github.com/starkware-libs/starknet-privacy)
- [Private Sprint hub](https://strk20.starknet.io/hackathon)

## License

MIT (see `LICENSE`)

import { useState } from "react";

type Tone = "public" | "hidden" | "conditional";

const sections: { title: string; tone: Tone; items: { field: string; observer: string; detail: string }[] }[] = [
  {
    title: "Public",
    tone: "public",
    items: [
      {
        field: "Your public address → pool deposit",
        observer: "Any public observer",
        detail: "A deposit of 10 STRK from your connected wallet into the STRK20 pool is visible on-chain.",
      },
      {
        field: "Encrypted note created",
        observer: "Any public observer",
        detail: "Observers can see that an encrypted note exists, not who owns it or how much it holds.",
      },
      {
        field: "Protocol metadata & proof verification",
        observer: "Any public observer",
        detail: "Required protocol metadata and proof validity are verified on-chain.",
      },
    ],
  },
  {
    title: "Hidden",
    tone: "hidden",
    items: [
      {
        field: "Note contents",
        observer: "Any public observer",
        detail: "The amount inside the note is masked. Only the intended recipient can recover the real value.",
      },
      {
        field: "Which notes were spent",
        observer: "Any public observer",
        detail: "The chain proves validity without revealing which specific notes were consumed.",
      },
      {
        field: "ZK proof contents",
        observer: "Any public observer",
        detail: "Starknet verifies that a valid zero-knowledge proof exists — never what is inside it.",
      },
    ],
  },
  {
    title: "Conditional",
    tone: "conditional",
    items: [
      {
        field: "Your history under legal request",
        observer: "Authorized auditor · compliance layer",
        detail: "A mandatory encrypted viewing key can reveal one user's history under a legitimate legal request.",
      },
    ],
  },
];

const css = `
  .demo-shell { min-height:100vh; background:#101417; color:#f2f5f3; font-family:Inter, ui-sans-serif, system-ui, sans-serif; }
  .demo-nav { height:72px; padding:0 34px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #2b3335; }
  .brand-lockup { display:flex; align-items:center; gap:12px; } .mark { font:800 16px/1 ui-monospace,monospace; letter-spacing:-2px; color:#dff8e8; } .mark span { color:#82e5ae; } .brand-name { font:600 13px/1 ui-monospace,monospace; letter-spacing:.03em; }
  .network-pill { color:#9aa9a3; font:600 10px ui-monospace,monospace; letter-spacing:.14em; } .network-pill i { display:inline-block; width:7px; height:7px; margin-right:7px; border-radius:50%; background:#62d695; box-shadow:0 0 0 3px #62d69522; }
  .action-strip { max-width:900px; margin:26px auto 0; padding:0 20px; display:flex; gap:8px; align-items:center; } .action-tab { border:1px solid #2b3335; color:#8e9d97; background:#171d1f; border-radius:6px; padding:11px 15px; font:600 12px ui-monospace,monospace; cursor:pointer; } .action-tab span { margin-right:8px; color:#82e5ae; } .action-tab.active { background:#dff8e8; color:#101417; border-color:#dff8e8; } .amount-chip { margin-left:auto; text-align:right; } .amount-chip span { display:block; text-transform:uppercase; letter-spacing:.14em; color:#77837e; font:10px ui-monospace,monospace; } .amount-chip strong { display:block; margin-top:4px; font:700 14px ui-monospace,monospace; color:#dff8e8; }
  .preview-backdrop { max-width:900px; margin:18px auto 60px; padding:0 20px; } .preview-card { border:1px solid #394345; background:#171d1f; box-shadow:0 20px 60px #0008; border-radius:8px; overflow:hidden; }
  .preview-header { display:flex; justify-content:space-between; padding:32px 34px 24px; border-bottom:1px solid #2b3335; } .eyebrow { color:#82e5ae; text-transform:uppercase; font:700 10px ui-monospace,monospace; letter-spacing:.16em; } h1 { margin:9px 0 9px; font:650 30px/1.1 Georgia,serif; letter-spacing:-.03em; } .preview-header p { max-width:590px; margin:0; color:#aab5b0; font-size:13px; line-height:1.6; } .close-btn { align-self:flex-start; border:0; background:transparent; color:#81908a; font-size:25px; cursor:pointer; }
  .metadata { display:grid; grid-template-columns:1.5fr 1fr 1fr; padding:18px 34px; background:#14191b; border-bottom:1px solid #2b3335; } .metadata span { display:block; margin-bottom:7px; color:#77837e; text-transform:uppercase; letter-spacing:.13em; font:9px ui-monospace,monospace; } .metadata strong { font:600 12px ui-monospace,monospace; } .metadata em { color:#77837e; font-style:normal; font-weight:400; }
  .sections { padding:23px 34px 10px; } .preview-section { margin-bottom:22px; } .section-heading { display:flex; align-items:center; gap:9px; margin-bottom:9px; } .section-heading h3 { margin:0; text-transform:uppercase; letter-spacing:.16em; font:700 10px ui-monospace,monospace; } .section-rule { height:1px; flex:1; background:#2b3335; } .section-dot { width:7px; height:7px; border-radius:50%; } .public .section-dot { background:#82e5ae; } .hidden .section-dot { background:#8da4d9; } .conditional .section-dot { background:#d9b267; }
  .public h3 { color:#82e5ae; } .hidden h3 { color:#9bb0e3; } .conditional h3 { color:#d9b267; } .item-list { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:#2b3335; border:1px solid #2b3335; border-radius:5px; overflow:hidden; } .visibility-item { padding:14px 16px; background:#1b2224; } .item-topline { display:flex; flex-direction:column; gap:5px; } .item-topline strong { font-size:12px; font-weight:600; color:#e4ebe7; } .item-topline span { color:#75827c; font:10px ui-monospace,monospace; } .visibility-item p { margin:9px 0 0; color:#aab5b0; font-size:11px; line-height:1.5; }
  .notice { margin:4px 34px 25px; display:flex; gap:11px; padding:13px 15px; border:1px solid #50462f; background:#28251c; border-radius:5px; color:#cdbb91; font-size:11px; line-height:1.5; } .notice p { margin:0; } .notice strong { color:#f0d38e; } .notice-icon { flex:0 0 auto; display:grid; place-items:center; width:16px; height:16px; border:1px solid #cdbb91; border-radius:50%; font:10px Georgia,serif; }
  .preview-footer { display:flex; justify-content:flex-end; gap:10px; padding:18px 34px; border-top:1px solid #2b3335; background:#14191b; } button { transition:all .15s ease; } .back-btn, .primary-btn { border-radius:5px; padding:11px 16px; font:600 11px ui-monospace,monospace; cursor:pointer; } .back-btn { border:1px solid #394345; color:#aab5b0; background:transparent; } .primary-btn { border:1px solid #82e5ae; color:#101417; background:#82e5ae; } .primary-btn span { margin-left:9px; } .back-btn:hover { border-color:#aab5b0; } .primary-btn:hover { background:#aaf2c8; }
  .empty-state { min-height:calc(100vh - 72px); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; } .empty-state p { max-width:350px; color:#9aa9a3; font-size:13px; line-height:1.6; margin:0 0 24px; }
  @media (max-width:680px) { .demo-nav { padding:0 18px; } .brand-name { display:none; } .action-strip { flex-wrap:wrap; } .amount-chip { margin-left:0; width:100%; text-align:left; margin-top:4px; } .preview-header, .metadata, .sections { padding-left:20px; padding-right:20px; } .metadata { grid-template-columns:1fr 1fr; gap:14px; } .metadata div:last-child { grid-column:span 2; } .item-list { grid-template-columns:1fr; } .notice { margin-left:20px; margin-right:20px; } .preview-footer { padding-left:20px; padding-right:20px; } }
`;

function Section({ title, tone, items }: (typeof sections)[number]) {
  return (
    <section className="preview-section">
      <div className={`section-heading ${tone}`}>
        <span className="section-dot" />
        <h3>{title}</h3>
        <span className="section-rule" />
      </div>
      <div className="item-list">
        {items.map((item) => (
          <article className="visibility-item" key={item.field}>
            <div className="item-topline">
              <strong>{item.field}</strong>
              <span>{item.observer}</span>
            </div>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PrivacyPreview() {
  const [action, setAction] = useState("Shield");
  const [closed, setClosed] = useState(false);

  if (closed) {
    return (
      <main className="demo-shell">
        <div className="demo-nav"><span className="mark">BY<span>S</span></span><span className="status">PREVIEW STATE · CANCELLED</span></div>
        <div className="empty-state">
          <span className="eyebrow">Before you sign</span>
          <h1>Nothing signed yet.</h1>
          <p>The preview keeps the action reversible until you explicitly confirm it.</p>
          <button className="primary-btn" onClick={() => setClosed(false)}>Reopen preview</button>
        </div>
      </main>
    );
  }

  return (
    <main className="demo-shell">
      <style>{css}</style>
      <div className="demo-nav">
        <div className="brand-lockup">
          <span className="mark">BY<span>S</span></span>
          <span className="brand-name">Before You Sign</span>
        </div>
        <span className="network-pill"><i /> SEPOLIA</span>
      </div>

      <div className="action-strip">
        {["Shield", "Send", "Unshield"].map((name) => (
          <button className={action === name ? "action-tab active" : "action-tab"} key={name} onClick={() => setAction(name)}>
            <span>{name === "Shield" ? "↑" : name === "Send" ? "↗" : "↓"}</span>{name}
          </button>
        ))}
        <div className="amount-chip"><span>Amount</span><strong>{action === "Shield" ? "10" : "1"} STRK</strong></div>
      </div>

      <div className="preview-backdrop">
        <div className="preview-card">
          <header className="preview-header">
            <div>
              <span className="eyebrow">Before you sign</span>
              <h1>Privacy preview</h1>
              <p>This is an honest before/after breakdown of what your transaction reveals — and what it keeps private.</p>
            </div>
            <button className="close-btn" aria-label="Close preview" onClick={() => setClosed(true)}>×</button>
          </header>

          <div className="metadata">
            <div><span>Action</span><strong>{action} <em>· STRK20 pool</em></strong></div>
            <div><span>Amount</span><strong>{action === "Shield" ? "10" : "1"} STRK</strong></div>
            <div><span>Shielded tx cost</span><strong>~4 STRK</strong></div>
          </div>

          <div className="sections">
            {sections.map((section) => <Section key={section.title} {...section} />)}
          </div>

          <div className="notice">
            <span className="notice-icon">i</span>
            <p><strong>Privacy is contextual.</strong> Entry and exit addresses remain linkable. In-pool activity is shielded from public observers.</p>
          </div>

          <footer className="preview-footer">
            <button className="back-btn" onClick={() => setClosed(true)}>Go back</button>
            <button className="primary-btn" onClick={() => setClosed(true)}>Sign transaction <span>→</span></button>
          </footer>
        </div>
      </div>
    </main>
  );
}

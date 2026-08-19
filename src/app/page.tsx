"use client";

import styles from './uni.module.css';
import SelectWallet from './components/client/WalletHandle/SelectWallet';
import WalletAccountV6Tag from './components/client/WalletHandle/WalletAccountV6Tag';

function BotanicalMark() {
  return (
    <svg
      className={styles.botanical}
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Main vertical line representing transaction flow */}
      <path
        d="M100 260V40"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Privacy shield container */}
      <rect x="60" y="60" width="80" height="60" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M100 70 L100 90 M90 80 L110 80" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      
      {/* Public observer layer */}
      <rect x="60" y="140" width="80" height="40" rx="4" stroke="currentColor" strokeWidth="1.25" fill="none" strokeDasharray="4 2" />
      <circle cx="85" cy="160" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="100" cy="160" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="115" cy="160" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
      
      {/* Hidden data layer */}
      <rect x="60" y="200" width="80" height="40" rx="4" stroke="currentColor" strokeWidth="1.25" fill="none" />
      <path d="M75 220 L100 205 L125 220" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Connection lines */}
      <path d="M100 120 L100 140" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M100 180 L100 200" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      
      {/* Input/Output nodes */}
      <circle cx="100" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="100" cy="260" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
      
      {/* Labels */}
      <text x="15" y="85" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.7">INPUT</text>
      <text x="15" y="165" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.7">PUBLIC</text>
      <text x="15" y="225" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.7">HIDDEN</text>
    </svg>
  );
}

export default function Page() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <pre className={styles.navTermLine}>
          <span className={styles.navPrompt}>strk20</span>
          <a href="#shield" className={styles.navLink}>--shield</a>
          <a href="#send" className={styles.navLink}>--send</a>
          <a href="#unshield" className={styles.navLink}>--unshield</a>
          <span className={styles.navCaret} aria-hidden="true">▮</span>
        </pre>
        <SelectWallet variant="nav" />
      </nav>

      <div className={styles.dashboard}>
        <header className={styles.editorialHero}>
          <div className={styles.heroCopy}>
            <p className={styles.dispatch}>■ Privacy system analysis</p>
            <h1 className={styles.heroTitle}>
              Transaction
              <br />
              <span className={styles.heroAccent}>schematics</span>
            </h1>
            <p className={styles.heroBody}>
              Engineering-grade privacy preview for STRK20. Analyze chain visibility,
              data flow, and compliance architecture before execution. Precision
              tools for private transactions.
            </p>
            <p className={styles.heroSign}>before-you-sign — system analysis</p>
          </div>
          <div className={styles.heroArt}>
            <BotanicalMark />
          </div>
        </header>

        <div className={styles.dashboardGrid}>
          <aside className={styles.contextCol}>
            <section className={styles.contextCard}>
              <h2 className={styles.contextTitle}>System workflow</h2>
              <ol className={styles.contextSteps}>
                <li>Configure shield/send/unshield parameters</li>
                <li>Analyze privacy preview — public/hidden/conditional data</li>
                <li>Execute transaction with full visibility awareness</li>
              </ol>
            </section>
            <section className={styles.contextCard}>
              <h2 className={styles.contextTitle}>Privacy constraints</h2>
              <ul className={styles.contextList}>
                <li>Shielding creates public link to pool entry point</li>
                <li>Unshielding reveals exit address and amount</li>
                <li>Compliance viewing keys exist — shown in analysis</li>
              </ul>
            </section>
          </aside>

          <main className={styles.actionCol}>
            <WalletAccountV6Tag />
          </main>
        </div>
      </div>

      <footer className={styles.footer}>
        <a href="https://github.com/Valorian0108/before-you-sign" target="_blank" rel="noreferrer">
          Repository
        </a>
        <span> · Starknet.js v10.4.0 · Cobalt × Starknet</span>
      </footer>
    </div>
  );
}

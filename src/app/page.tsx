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
      <defs>
        {/* Gradient for data flow */}
        <linearGradient id="dataFlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Main vertical line representing transaction flow */}
      <path
        d="M100 260V40"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={styles.flowLine}
      />

      {/* Animated data flow particles */}
      <circle cx="100" cy="20" r="3" fill="currentColor" className={styles.flowParticle1}>
        <animate attributeName="cy" values="20;260;20" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="60" r="2" fill="currentColor" className={styles.flowParticle2}>
        <animate attributeName="cy" values="60;260;60" dur="3s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="100" r="2" fill="currentColor" className={styles.flowParticle3}>
        <animate attributeName="cy" values="100;260;100" dur="3s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1s" repeatCount="indefinite" />
      </circle>

      {/* Privacy shield container */}
      <rect x="60" y="60" width="80" height="60" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" className={styles.shieldBox}>
        <animate attributeName="strokeOpacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </rect>
      <path d="M100 70 L100 90 M90 80 L110 80" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className={styles.shieldIcon}>
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
      </path>

      {/* Public observer layer */}
      <rect x="60" y="140" width="80" height="40" rx="4" stroke="currentColor" strokeWidth="1.25" fill="none" strokeDasharray="4 2" className={styles.publicBox}>
        <animate attributeName="strokeDashoffset" values="0;12;0" dur="2s" repeatCount="indefinite" />
      </rect>
      <circle cx="85" cy="160" r="3" stroke="currentColor" strokeWidth="1" fill="none" className={styles.publicDot}>
        <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="160" r="3" stroke="currentColor" strokeWidth="1" fill="none" className={styles.publicDot}>
        <animate attributeName="r" values="2;4;2" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="115" cy="160" r="3" stroke="currentColor" strokeWidth="1" fill="none" className={styles.publicDot}>
        <animate attributeName="r" values="2;4;2" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
      </circle>

      {/* Hidden data layer */}
      <rect x="60" y="200" width="80" height="40" rx="4" stroke="currentColor" strokeWidth="1.25" fill="none" className={styles.hiddenBox}>
        <animate attributeName="strokeOpacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" />
      </rect>
      <path d="M75 220 L100 205 L125 220" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={styles.hiddenIcon}>
        <animate attributeName="opacity" values="0.2;1;0.2" dur="2.5s" repeatCount="indefinite" />
      </path>

      {/* Connection lines */}
      <path d="M100 120 L100 140" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className={styles.connector}>
        <animate attributeName="strokeOpacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M100 180 L100 200" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className={styles.connector}>
        <animate attributeName="strokeOpacity" values="0.3;1;0.3" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </path>

      {/* Input/Output nodes */}
      <circle cx="100" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" className={styles.node}>
        <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="260" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" className={styles.node}>
        <animate attributeName="r" values="5;7;5" dur="2s" begin="1s" repeatCount="indefinite" />
      </circle>

      {/* Labels */}
      <text x="15" y="85" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.7" className={styles.label}>INPUT</text>
      <text x="15" y="165" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.7" className={styles.label}>PUBLIC</text>
      <text x="15" y="225" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.7" className={styles.label}>HIDDEN</text>
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
            <p className={styles.heroSign}>before-you-sign | system analysis</p>
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
                <li>Analyze privacy preview | public/hidden/conditional data</li>
                <li>Execute transaction with full visibility awareness</li>
              </ol>
            </section>
            <section className={styles.contextCard}>
              <h2 className={styles.contextTitle}>Privacy constraints</h2>
              <ul className={styles.contextList}>
                <li>Shielding creates public link to pool entry point</li>
                <li>Unshielding reveals exit address and amount</li>
                <li>Compliance viewing keys exist | shown in analysis</li>
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

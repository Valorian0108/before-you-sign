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
      <path
        d="M100 260V80"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M100 120C72 100 48 88 32 72M100 100C128 82 152 68 168 52M100 160C70 148 52 132 40 112M100 155C130 142 148 126 160 108M100 200C78 192 62 178 52 162M100 198C122 188 138 174 148 158"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <ellipse cx="32" cy="72" rx="14" ry="22" transform="rotate(-35 32 72)" stroke="currentColor" strokeWidth="1.25" />
      <ellipse cx="168" cy="52" rx="14" ry="22" transform="rotate(35 168 52)" stroke="currentColor" strokeWidth="1.25" />
      <ellipse cx="40" cy="112" rx="12" ry="20" transform="rotate(-28 40 112)" stroke="currentColor" strokeWidth="1.25" />
      <ellipse cx="160" cy="108" rx="12" ry="20" transform="rotate(28 160 108)" stroke="currentColor" strokeWidth="1.25" />
      <ellipse cx="52" cy="162" rx="11" ry="18" transform="rotate(-22 52 162)" stroke="currentColor" strokeWidth="1.25" />
      <ellipse cx="148" cy="158" rx="11" ry="18" transform="rotate(22 148 158)" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export default function Page() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.brandSlash}>/</span>
          <span className={styles.brandName}>STRK20</span>
          <span className={styles.brandTag}>privacy preview</span>
        </div>
        <SelectWallet variant="nav" />
      </nav>

      <div className={styles.dashboard}>
        <header className={styles.editorialHero}>
          <div className={styles.heroCopy}>
            <p className={styles.dispatch}>■ A privacy dispatch</p>
            <h1 className={styles.heroTitle}>
              See what stays
              <br />
              <span className={styles.heroAccent}>private</span>
            </h1>
            <p className={styles.heroBody}>
              For Starknet users who want shielded STRK but don&apos;t yet understand
              what the chain actually reveals. Preview every action before you sign —
              honestly, with the compliance layer included.
            </p>
            <p className={styles.heroSign}>— before you sign</p>
          </div>
          <div className={styles.heroArt}>
            <BotanicalMark />
          </div>
        </header>

        <div className={styles.dashboardGrid}>
          <aside className={styles.contextCol}>
            <section className={styles.contextCard}>
              <h2 className={styles.contextTitle}>How it works</h2>
              <ol className={styles.contextSteps}>
                <li>Configure a shield, send, or unshield</li>
                <li>Open the privacy preview — what&apos;s public, hidden, conditional</li>
                <li>Sign in Ready only when you understand the tradeoffs</li>
              </ol>
            </section>
            <section className={styles.contextCard}>
              <h2 className={styles.contextTitle}>What we never claim</h2>
              <ul className={styles.contextList}>
                <li>Shielding links your public wallet to the pool</li>
                <li>Unshielding reveals exit address and amount</li>
                <li>Viewing keys exist for compliance — shown in every preview</li>
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
        <span className={styles.footerDot}>·</span>
        <span>Starknet.js v10.4.0</span>
        <span className={styles.footerDot}>·</span>
        <span>Garden × Starknet</span>
      </footer>
    </div>
  );
}

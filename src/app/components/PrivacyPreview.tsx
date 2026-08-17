"use client";

import type { PrivacySimulation, VisibilityItem } from "@/utils/privacySimulator";
import styles from "../uni.module.css";

type Props = {
  simulation: PrivacySimulation;
  onConfirm: () => void;
  onCancel: () => void;
  confirming?: boolean;
};

function Section({
  title,
  items,
  tone,
}: {
  title: string;
  items: VisibilityItem[];
  tone: "public" | "hidden" | "conditional";
}) {
  if (!items.length) return null;
  const toneClass =
    tone === "public"
      ? styles.previewPublic
      : tone === "hidden"
      ? styles.previewHidden
      : styles.previewConditional;

  return (
    <section className={styles.previewSection}>
      <h3 className={`${styles.previewSectionTitle} ${toneClass}`}>{title}</h3>
      <ul className={styles.previewList}>
        {items.map((item) => (
          <li key={item.field} className={styles.previewItem}>
            <div className={styles.previewField}>{item.field}</div>
            <div className={styles.previewMeta}>{item.observer}</div>
            <p className={styles.previewDetail}>{item.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PrivacyPreview({ simulation, onConfirm, onCancel, confirming }: Props) {
  return (
    <div className={styles.previewOverlay} role="dialog" aria-modal="true" aria-labelledby="privacy-preview-title">
      <div className={styles.previewCard}>
        <div className={styles.previewHead}>
          <p className={styles.previewEyebrow}>Before you sign</p>
          <h2 id="privacy-preview-title" className={styles.previewTitle}>
            Privacy preview
          </h2>
          <p className={styles.previewSummary}>{simulation.summary}</p>
        </div>

        <div className={styles.previewMetaRow}>
          <span>
            <b>Action:</b> {simulation.actionLabel}
          </span>
          <span>
            <b>Amount:</b> {simulation.amountLabel}
          </span>
          <span>
            <b>Shielded tx cost:</b> {simulation.networkFee}
          </span>
        </div>

        <Section title="What a public observer will see" items={simulation.visible} tone="public" />
        <Section title="What stays hidden on-chain" items={simulation.hidden} tone="hidden" />
        <Section
          title="What could be seen under specific conditions"
          items={simulation.conditional}
          tone="conditional"
        />

        {simulation.tips.length > 0 && (
          <div className={styles.previewTips}>
            <div className={styles.previewTipsTitle}>Practical notes</div>
            <ul>
              {simulation.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.previewActions}>
          <button type="button" className={styles.btnGhost} onClick={onCancel} disabled={confirming}>
            Go back
          </button>
          <button type="button" className={styles.btnCta} onClick={onConfirm} disabled={confirming}>
            {confirming ? "Waiting for wallet…" : "Sign transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

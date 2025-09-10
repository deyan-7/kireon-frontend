import React from 'react';
import styles from './BereicheSidebar.module.scss';
import { Bereich } from '@/lib/hooks/useLaws';

type Props = {
  bereiche: Bereich[];
  bereichCounts: Map<string, number>;
  selected: Bereich | null;
  onSelect: (bereich: Bereich | null) => void;
};

export default function BereicheSidebar({ bereiche, bereichCounts, selected, onSelect }: Props) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3>Bereiche</h3>
      </div>
      <ul className={styles.bereichList}>
        <li 
          className={`${styles.bereichItem} ${!selected ? styles.active : ''}`}
          onClick={() => onSelect(null)}
        >
          <span className={styles.bereichName}>Alle anzeigen</span>
          <span className={styles.count}>
            {Array.from(bereichCounts.values()).reduce((a, b) => a + b, 0)}
          </span>
        </li>
        {bereiche.map((bereich) => {
          const count = bereichCounts.get(bereich.name) || 0;
          return (
            <li
              key={bereich.name}
              className={`${styles.bereichItem} ${
                selected?.name === bereich.name ? styles.active : ''
              }`}
              onClick={() => onSelect(bereich)}
            >
              <span className={styles.bereichName}>{bereich.name}</span>
              <span className={styles.count}>{count}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
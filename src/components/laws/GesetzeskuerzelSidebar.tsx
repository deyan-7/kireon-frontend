import React from 'react';
import styles from '@/components/BereicheSidebar.module.scss';

type Props = {
  kuerzelList: string[];
  kuerzelCounts: Map<string, number>;
  selected: string | null;
  onSelect: (kuerzel: string | null) => void;
  totalCount: number;
};

export default function GesetzeskuerzelSidebar({ kuerzelList, kuerzelCounts, selected, onSelect, totalCount }: Props) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3>Gesetzeskürzel</h3>
      </div>
      <ul className={styles.bereichList}>
        <li
          className={`${styles.bereichItem} ${!selected ? styles.active : ''}`}
          onClick={() => onSelect(null)}
        >
          <span className={styles.bereichName}>Alle anzeigen</span>
          <span className={styles.count}>
            {totalCount}
          </span>
        </li>
        {kuerzelList.map((kuerzel) => {
          const count = kuerzelCounts.get(kuerzel) || 0;
          return (
            <li
              key={kuerzel}
              className={`${styles.bereichItem} ${selected === kuerzel ? styles.active : ''}`}
              onClick={() => onSelect(kuerzel)}
            >
              <span className={styles.bereichName}>{kuerzel}</span>
              <span className={styles.count}>{count}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
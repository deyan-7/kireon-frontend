import React from 'react';
import styles from './BereicheSidebar.module.scss';

interface BereicheSidebarProps {
  bereiche: string[];
  bereichCounts: Map<string, number>;
  selected: string | null;
  onSelect: (bereich: string | null) => void;
  totalCount: number;
}

const BereicheSidebar: React.FC<BereicheSidebarProps> = ({
  bereiche,
  bereichCounts,
  selected,
  onSelect,
  totalCount,
}) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3>Bereiche</h3>
        <div className={styles.totalCount}>
          {totalCount} Einträge
        </div>
      </div>
      
      <div className={styles.sidebarContent}>
        <button
          className={`${styles.sidebarItem} ${selected === null ? styles.active : ''}`}
          onClick={() => onSelect(null)}
        >
          <span className={styles.itemName}>Alle Bereiche</span>
          <span className={styles.itemCount}>{totalCount}</span>
        </button>
        
        {bereiche.map((bereich) => {
          const count = bereichCounts.get(bereich) || 0;
          return (
            <button
              key={bereich}
              className={`${styles.sidebarItem} ${selected === bereich ? styles.active : ''}`}
              onClick={() => onSelect(bereich)}
            >
              <span className={styles.itemName}>{bereich}</span>
              <span className={styles.itemCount}>{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BereicheSidebar;

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Rahmengesetzgebung } from '@/types/laws';
import TagDisplay from './TagDisplay';
import CollapsibleSection from './CollapsibleSection';
import styles from './LawDetailDialog.module.scss';

interface LawDetailDialogProps {
  law: Rahmengesetzgebung;
  onClose: () => void;
}

const LawDetailDialog: React.FC<LawDetailDialogProps> = ({ law, onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h2 className={styles.title}>{law.kurztitel}</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Schließen"
          >
            <XMarkIcon className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.content}>
          <TagDisplay tags={[law.stichwort]} title="Stichwort" />

          <CollapsibleSection title="Weitere Parameter">
            <div className={styles.parameterList}>
              <div className={styles.parameter}>
                <span className={styles.parameterLabel}>Gesetz:</span>
                <span className={styles.parameterValue}>{law.gesetz}</span>
              </div>
              <div className={styles.parameter}>
                <span className={styles.parameterLabel}>Englischer Titel:</span>
                <span className={styles.parameterValue}>{law.shortTitle}</span>
              </div>
            </div>
          </CollapsibleSection>

          <div className={styles.infoSection}>
            <h3>Informationen</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute 
              irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
              pariatur.
            </p>
          </div>

          <div className={styles.recommendationsSection}>
            <h3>Konkrete Empfehlungen</h3>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
              mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit 
              voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae 
              ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawDetailDialog;
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Rahmengesetzgebung } from '@/types/laws';
import TagDisplay from '@/components/TagDisplay';
import CollapsibleSection from '@/components/CollapsibleSection';
import styles from './GeneralLawDetailDialog.module.scss';

interface GeneralLawDetailDialogProps {
  law: Rahmengesetzgebung;
  onClose: () => void;
}

const GeneralLawDetailDialog: React.FC<GeneralLawDetailDialogProps> = ({ law, onClose }) => {
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
              Weitere Informationen zu diesem Rahmengesetz werden hier angezeigt.
            </p>
          </div>

          <div className={styles.recommendationsSection}>
            <h3>Konkrete Empfehlungen</h3>
            <p>
              Handlungsempfehlungen für dieses Rahmengesetz werden hier aufgeführt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralLawDetailDialog;
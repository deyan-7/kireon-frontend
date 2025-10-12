"use client";

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import styles from './DetailPanel.module.scss';

interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.panelOverlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Schließen">
            <XMarkIcon className={styles.closeIcon} />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default DetailPanel;


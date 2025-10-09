// src/components/shared/RightSidebar.tsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import styles from './RightSidebar.module.scss';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Schließen"
          >
            <XMarkIcon className={styles.closeIcon} />
          </button>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;

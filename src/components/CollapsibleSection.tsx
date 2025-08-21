import React, { useState } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import styles from './CollapsibleSection.module.scss';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.collapsibleSection}>
      <button
        className={styles.header}
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <span className={styles.title}>{title}</span>
        <ChevronUpIcon 
          className={`${styles.icon} ${!isOpen ? styles.rotated : ''}`}
        />
      </button>
      {isOpen && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import styles from './ResizableSplitView.module.scss';

interface ResizableSplitViewProps {
  mainContent: React.ReactNode;
  sidePanelContent: React.ReactNode;
  isSidePanelOpen: boolean;
  onSidePanelClose: () => void;
  initialSidePanelWidth?: number;
  minSidePanelWidth?: number;
}

const ResizableSplitView: React.FC<ResizableSplitViewProps> = ({
  mainContent,
  sidePanelContent,
  isSidePanelOpen,
  onSidePanelClose,
  initialSidePanelWidth = 400,
  minSidePanelWidth = 300,
}) => {
  const [panelWidth, setPanelWidth] = useState(initialSidePanelWidth);
  const isResizing = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= minSidePanelWidth) {
      setPanelWidth(newWidth);
    }
  }, [minSidePanelWidth]);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className={styles.splitViewContainer}>
      <div
        className={styles.mainPanel}
        style={{ width: isSidePanelOpen ? `calc(100% - ${panelWidth}px - 5px)` : '100%' }}
      >
        {mainContent}
      </div>
      {isSidePanelOpen && (
        <>
          <div
            className={styles.dragger}
            onMouseDown={handleMouseDown}
          />
          <div className={styles.sidePanel} style={{ width: `${panelWidth}px` }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem' }}>
              <button
                type="button"
                onClick={onSidePanelClose}
                aria-label="Seitenpanel schließen"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '9999px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#fff',
                  color: '#4b5563',
                  cursor: 'pointer',
                }}
              >
                <XMarkIcon style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>
            <div className={styles.sidePanelContent}>
              {sidePanelContent}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ResizableSplitView;

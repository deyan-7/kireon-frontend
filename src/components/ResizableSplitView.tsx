"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    if (!isSidePanelOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onSidePanelClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidePanelOpen, onSidePanelClose]);

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

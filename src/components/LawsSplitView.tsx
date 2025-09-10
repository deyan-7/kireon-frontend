import React from 'react';
import styles from './LawsSplitView.module.scss';

type Props = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

export default function LawsSplitView({ sidebar, children }: Props) {
  return (
    <div className={styles.splitViewContainer}>
      <aside className={styles.sidebarPanel}>{sidebar}</aside>
      <main className={styles.contentPanel}>{children}</main>
    </div>
  );
}
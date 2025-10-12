import React from 'react';
import styles from './InstructionCard.module.scss';

interface InstructionCardProps {
  title: string;
  instructions: string | null;
}

const InstructionCard: React.FC<InstructionCardProps> = ({ title, instructions }) => {
  if (!instructions) return null;
  return (
    <div className={styles.card}>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.instructions}>{instructions}</p>
    </div>
  );
};

export default InstructionCard;


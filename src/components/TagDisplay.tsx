import React from 'react';
import styles from './TagDisplay.module.scss';

interface TagDisplayProps {
  tags: string[];
  title?: string;
}

const TagDisplay: React.FC<TagDisplayProps> = ({ tags, title }) => {
  return (
    <div className={styles.tagDisplay}>
      {title && <span className={styles.title}>{title}:</span>}
      <div className={styles.tagContainer}>
        {tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagDisplay;
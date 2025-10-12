import React from 'react';
import { Beleg } from '@/types/pflicht';

interface SourcesViewProps {
  belege: Beleg[];
}

const SourcesView: React.FC<SourcesViewProps> = ({ belege }) => {
  if (!belege || belege.length === 0) {
    return <div style={{ padding: '1rem' }}>Keine Quellen verfügbar.</div>;
  }

  return (
    <div style={{ padding: '1rem', overflowY: 'auto', height: '100%' }}>
      {belege.map((beleg, index) => (
        <div key={index} style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
            {beleg.anker || beleg.quelle}
          </h4>
          <p style={{ color: '#4b5563', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
            {beleg.textauszug || beleg.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SourcesView;

